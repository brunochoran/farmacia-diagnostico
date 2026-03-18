export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const token = process.env.KOMMO_ACCESS_TOKEN
  const subdomain = process.env.KOMMO_SUBDOMAIN

  if (!token || !subdomain) {
    console.error('[Kommo] Variáveis de ambiente não configuradas')
    return res.status(500).json({ error: 'Kommo não configurado' })
  }

  const {
    nome,
    telefone,
    email,
    empresa,
    site,
    faturamentoMensal,
    profileName,
    totalScore,
    pharmaId,
  } = req.body

  // ── Contato ───────────────────────────────────────────────
  const contactFields = [
    { field_code: 'PHONE', values: [{ value: telefone, enum_code: 'WORK' }] },
  ]
  if (email) {
    contactFields.push({
      field_code: 'EMAIL',
      values: [{ value: email, enum_code: 'WORK' }],
    })
  }

  // ── Empresa ───────────────────────────────────────────────
  const companyFields = []
  if (site) {
    companyFields.push({
      field_code: 'WEB',
      values: [{ value: site }],
    })
  }
  if (faturamentoMensal) {
    companyFields.push({
      field_id: 1573793, // Faturamento
      values: [{ value: String(faturamentoMensal) }],
    })
  }

  // ── Lead custom fields ─────────────────────────────────────
  const leadFields = [
    {
      field_id: 1573659, // Origem do Lead
      values: [{ enum_id: 1139135 }], // "Evento"
    },
    {
      field_id: 1573356, // Source
      values: [{ value: 'PharmaShare' }],
    },
    {
      field_id: 1572762, // utm_source
      values: [{ value: 'PharmaShare' }],
    },
  ]

  // ── Payload complex ───────────────────────────────────────
  const payload = [
    {
      name: empresa || nome,
      custom_fields_values: leadFields,
      _embedded: {
        contacts: [
          {
            name: nome,
            custom_fields_values: contactFields,
          },
        ],
        ...(empresa
          ? {
              companies: [
                {
                  name: empresa,
                  custom_fields_values: companyFields,
                },
              ],
            }
          : {}),
      },
    },
  ]

  let kommoRes
  try {
    kommoRes = await fetch(`https://${subdomain}.kommo.com/api/v4/leads/complex`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
  } catch (err) {
    console.error('[Kommo] Erro de rede:', err)
    return res.status(502).json({ error: 'Kommo unreachable' })
  }

  if (!kommoRes.ok) {
    const body = await kommoRes.text()
    console.error('[Kommo] Erro da API:', kommoRes.status, body)
    return res.status(502).json({ error: 'Kommo API error', detail: body })
  }

  const data = await kommoRes.json()
  const leadId = data?._embedded?.leads?.[0]?.id

  // ── Nota no lead com dados do diagnóstico ─────────────────
  if (leadId) {
    const noteParts = [
      profileName ? `Perfil: ${profileName} (nota ${totalScore ?? '—'})` : null,
      pharmaId ? `pharma_id: ${pharmaId}` : null,
    ].filter(Boolean)

    if (noteParts.length > 0) {
      await fetch(`https://${subdomain}.kommo.com/api/v4/leads/${leadId}/notes`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          {
            note_type: 'common',
            params: { text: noteParts.join('\n') },
          },
        ]),
      }).catch(err => console.error('[Kommo] Erro ao criar nota:', err))
    }
  }

  console.log('[Kommo] Lead criado, id:', leadId)
  return res.status(200).json({ ok: true, leadId })
}
