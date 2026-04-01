const BASE = (subdomain) => `https://${subdomain}.kommo.com/api/v4`

async function kommoFetch(subdomain, token, path, method = 'GET', body) {
  const res = await fetch(`${BASE(subdomain)}${path}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })
  return res
}

// Busca contato pelo telefone — retorna { contactId, leadId } ou null
// Kommo retorna 204 quando não encontra nada, então tratamos isso explicitamente
async function findByPhone(subdomain, token, telefone) {
  try {
    if (!telefone) return null
    const r = await kommoFetch(subdomain, token, `/contacts?query=${encodeURIComponent(telefone)}&with=leads`)
    if (!r.ok || r.status === 204) return null
    const text = await r.text()
    if (!text) return null
    const data = JSON.parse(text)
    const contact = data?._embedded?.contacts?.[0]
    if (!contact) return null
    const leadId = contact?._embedded?.leads?.[0]?.id ?? null
    return { contactId: contact.id, leadId }
  } catch (err) {
    console.error('[Kommo] Erro ao buscar contato:', err)
    return null // falha silenciosa — não bloqueia criação de lead
  }
}

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

  const { nome, telefone, email, empresa, site, faturamentoMensal, profileName, totalScore, pharmaId, utmSource, nota } = req.body

  try {
    // ── Verifica se já existe contato com esse telefone ───────
    const existing = await findByPhone(subdomain, token, telefone)

    if (existing) {
      // ── ATUALIZA lead e contato existentes ─────────────────
      console.log('[Kommo] Contato existente, atualizando:', existing)

      const updates = []

      if (existing.leadId) {
        const leadPatch = { custom_fields_values: [] }
        if (profileName) leadPatch.name = empresa || nome

        const noteText = nota || [
          profileName ? `Perfil: ${profileName} (nota ${totalScore ?? '—'})` : null,
          pharmaId ? `pharma_id: ${pharmaId}` : null,
        ].filter(Boolean).join('\n')

        if (noteText) {
          updates.push(
            kommoFetch(subdomain, token, `/leads/${existing.leadId}/notes`, 'POST', [
              { note_type: 'common', params: { text: noteText } },
            ])
          )
        }

        updates.push(
          kommoFetch(subdomain, token, `/leads/${existing.leadId}`, 'PATCH', leadPatch)
        )
      }

      if (email) {
        updates.push(
          kommoFetch(subdomain, token, `/contacts/${existing.contactId}`, 'PATCH', {
            custom_fields_values: [
              { field_code: 'EMAIL', values: [{ value: email, enum_code: 'WORK' }] },
            ],
          })
        )
      }

      // Atualiza empresa se houver dados novos
      if (empresa || site || faturamentoMensal) {
        const companyFields = []
        if (site) companyFields.push({ field_code: 'WEB', values: [{ value: site }] })
        if (faturamentoMensal) companyFields.push({ field_id: 1573793, values: [{ value: String(faturamentoMensal) }] })

        if (companyFields.length > 0) {
          try {
            const cRes = await kommoFetch(subdomain, token, `/contacts/${existing.contactId}?with=companies`)
            if (cRes.ok) {
              const cText = await cRes.text()
              const cData = cText ? JSON.parse(cText) : null
              const companyId = cData?._embedded?.companies?.[0]?.id
              if (companyId) {
                updates.push(
                  kommoFetch(subdomain, token, `/companies/${companyId}`, 'PATCH', {
                    ...(empresa ? { name: empresa } : {}),
                    custom_fields_values: companyFields,
                  })
                )
              }
            }
          } catch (err) {
            console.error('[Kommo] Erro ao buscar empresa:', err)
          }
        }
      }

      await Promise.all(updates).catch(err => console.error('[Kommo] Erro ao atualizar:', err))
      console.log('[Kommo] Lead atualizado, id:', existing.leadId)
      return res.status(200).json({ ok: true, leadId: existing.leadId, action: 'updated' })
    }

    // ── CRIA novo lead ─────────────────────────────────────────
    const contactFields = [
      { field_code: 'PHONE', values: [{ value: telefone, enum_code: 'WORK' }] },
    ]
    if (email) contactFields.push({ field_code: 'EMAIL', values: [{ value: email, enum_code: 'WORK' }] })

    const companyFields = []
    if (site) companyFields.push({ field_code: 'WEB', values: [{ value: site }] })
    if (faturamentoMensal) companyFields.push({ field_id: 1573793, values: [{ value: String(faturamentoMensal) }] })

    const sourceValue = utmSource || 'PharmaShare'
    const leadFields = [
      { field_id: 1573659, values: [{ enum_id: 1139135 }] }, // Origem do Lead = Evento
      { field_id: 1573356, values: [{ value: sourceValue }] }, // Source
      { field_id: 1572762, values: [{ value: sourceValue }] }, // utm_source
    ]

    const payload = [
      {
        name: empresa || nome,
        custom_fields_values: leadFields,
        _embedded: {
          contacts: [{ name: nome, custom_fields_values: contactFields }],
          ...(empresa ? { companies: [{ name: empresa, ...(companyFields.length > 0 ? { custom_fields_values: companyFields } : {}) }] } : {}),
        },
      },
    ]

    const kommoRes = await kommoFetch(subdomain, token, '/leads/complex', 'POST', payload)

    if (!kommoRes.ok) {
      const body = await kommoRes.text()
      console.error('[Kommo] Erro da API:', kommoRes.status, body)
      return res.status(502).json({ error: 'Kommo API error', detail: body })
    }

    const data = await kommoRes.json()
    const leadId = data?._embedded?.leads?.[0]?.id

    if (leadId) {
      const noteText = nota || [
        profileName ? `Perfil: ${profileName} (nota ${totalScore ?? '—'})` : null,
        pharmaId ? `pharma_id: ${pharmaId}` : null,
      ].filter(Boolean).join('\n')

      if (noteText) {
        await kommoFetch(subdomain, token, `/leads/${leadId}/notes`, 'POST', [
          { note_type: 'common', params: { text: noteText } },
        ]).catch(err => console.error('[Kommo] Erro ao criar nota:', err))
      }
    }

    console.log('[Kommo] Lead criado, id:', leadId)
    return res.status(200).json({ ok: true, leadId, action: 'created' })

  } catch (err) {
    console.error('[Kommo] Erro inesperado:', err)
    return res.status(500).json({ error: 'Erro interno', detail: err.message })
  }
}
