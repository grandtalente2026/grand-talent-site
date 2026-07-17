import { useState } from "react";

const CORES = {
  verde: "#1A7A4A",
  verdeClaro: "#E8F5EE",
  amarelo: "#D4820A",
  amareloClaro: "#FFF8E7",
  vermelho: "#C0392B",
  vermelhoClaro: "#FDEDEB",
  verdeMarca: "#1A3D2B",
  azulMarca: "#1A237E",
  cinzaClaro: "#F7F8FA",
  cinzaMedio: "#4A5568",
  branco: "#FFFFFF",
};

const EMPRESA = {
  nome: "[NOME DA EMPRESA]",
  setor: "Manufatura Industrial",
  total: 100,
  data: "Junho 2026",
};

const SETORES = [
  { nome: "Produção", grandMean: 2.7, cor: "vermelho", colaboradores: 42 },
  { nome: "Logística", grandMean: 3.6, cor: "verde", colaboradores: 22 },
  { nome: "Qualidade", grandMean: 3.0, cor: "amarelo", colaboradores: 18 },
  { nome: "Manutenção", grandMean: 2.5, cor: "vermelho", colaboradores: 12 },
  { nome: "Administrativo", grandMean: 3.9, cor: "verde", colaboradores: 6 },
];

const DIMENSOES = [
  { sigla: "D1", nome: "Clareza e Recursos", score: 3.7, cor: "verde", descricao: "Colaboradores entendem seu papel e têm o que precisam para entregar." },
  { sigla: "D2", nome: "Talentos e Reconhecimento", score: 3.2, cor: "amarelo", descricao: "Talentos individuais percebidos e valorizados pela liderança." },
  { sigla: "D3", nome: "Liderança e Desenvolvimento", score: 2.8, cor: "vermelho", descricao: "Qualidade da liderança direta e percepção de crescimento profissional." },
  { sigla: "D4", nome: "Voz, Propósito e Qualidade", score: 3.1, cor: "amarelo", descricao: "Colaboradores sentem que sua opinião importa e seu trabalho tem propósito." },
  { sigla: "D5", nome: "Pertencimento e Carreira", score: 3.5, cor: "verde", descricao: "Senso de pertença à equipe e clareza sobre o futuro na empresa." },
  { sigla: "D6", nome: "Segurança Psicológica", score: 2.6, cor: "vermelho", descricao: "Segurança para falar, errar e contribuir sem medo de punição." },
];

const grandMean = 3.15;

// Passivo calculado para 100 colaboradores
const PASSIVO = {
  turnover: { valor: 105000, descricao: "14 saídas/ano × R$7.500 (1,5× salário médio R$5.000)" },
  absenteismo: { valor: 141600, descricao: "Folha R$6.000.000 × 4,7% × 50% evitável" },
  acidentes: { valor: 54000, descricao: "3 ocorrências/ano × R$18.000 (benchmark SESMT)" },
  total: 300600,
  mensal: 25050,
};

function StatusDot({ cor, size = 12 }) {
  const bg = { verde: CORES.verde, amarelo: CORES.amarelo, vermelho: CORES.vermelho }[cor];
  return <span style={{ display: "inline-block", width: size, height: size, borderRadius: "50%", background: bg, flexShrink: 0 }} />;
}

function Barra({ score, cor }) {
  const fill = { verde: CORES.verde, amarelo: CORES.amarelo, vermelho: CORES.vermelho }[cor];
  return (
    <div style={{ height: 8, background: "#E5E7EB", borderRadius: 4, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${(score / 5) * 100}%`, background: fill, borderRadius: 4, transition: "width 0.5s ease" }} />
    </div>
  );
}

function Medidor({ valor }) {
  const pct = ((valor - 1) / 4) * 100;
  const cor = valor >= 3.5 ? CORES.verde : valor >= 2.8 ? CORES.amarelo : CORES.vermelho;
  const label = valor >= 3.5 ? "SAUDÁVEL" : valor >= 2.8 ? "ATENÇÃO" : "CRÍTICO";
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{
        width: 140, height: 140, borderRadius: "50%", margin: "0 auto",
        background: `conic-gradient(${cor} 0% ${pct}%, #E5E7EB ${pct}% 100%)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: `0 0 0 6px white, 0 0 0 8px ${cor}33`,
      }}>
        <div style={{ width: 105, height: 105, borderRadius: "50%", background: "white", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 32, fontWeight: 900, color: cor, lineHeight: 1 }}>{valor.toFixed(1)}</span>
          <span style={{ fontSize: 10, color: CORES.cinzaMedio, fontWeight: 600 }}>de 5.0</span>
        </div>
      </div>
      <div style={{ marginTop: 10, display: "inline-block", padding: "3px 14px", borderRadius: 20, background: cor + "22", border: `1.5px solid ${cor}`, color: cor, fontSize: 11, fontWeight: 700, letterSpacing: 1.5 }}>{label}</div>
    </div>
  );
}

function Card({ children, style }) {
  return <div style={{ background: CORES.branco, borderRadius: 12, padding: "18px 22px", boxShadow: "0 1px 4px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.05)", ...style }}>{children}</div>;
}

function SecTitle({ children }) {
  return <h3 style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: CORES.cinzaMedio, margin: "0 0 14px 0", borderBottom: `2px solid ${CORES.verdeMarca}`, paddingBottom: 5 }}>{children}</h3>;
}

function fmt(n) { return "R$ " + n.toLocaleString("pt-BR"); }

export default function Dashboard() {
  const [tab, setTab] = useState("geral");
  const [setorIdx, setSetorIdx] = useState(null);
  const [dimIdx, setDimIdx] = useState(null);

  return (
    <div style={{ fontFamily: "'Inter','Helvetica Neue',Arial,sans-serif", background: CORES.cinzaClaro, minHeight: "100vh" }}>

      {/* Header */}
      <div style={{ background: CORES.verdeMarca, padding: "14px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ color: "white", fontSize: 17, fontWeight: 800 }}>SISTEMA 4.0 <span style={{ color: "#A7F3D0", fontWeight: 400 }}>/ IBEP-4.0</span></div>
          <div style={{ color: "#86efac", fontSize: 11, marginTop: 2 }}>Painel de Diagnóstico Organizacional</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ color: "white", fontWeight: 700, fontSize: 15 }}>{EMPRESA.nome}</div>
          <div style={{ color: "#86efac", fontSize: 11 }}>{EMPRESA.setor} · {EMPRESA.total} colaboradores · {EMPRESA.data}</div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {[["geral","Visão Geral"],["setores","Por Setor"],["dimensoes","6 Dimensões"],["passivo","Passivo"]].map(([t,l]) => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: "5px 14px", borderRadius: 8, border: "none", cursor: "pointer",
              fontSize: 11, fontWeight: 600,
              background: tab === t ? "#A7F3D0" : "rgba(255,255,255,0.12)",
              color: tab === t ? CORES.verdeMarca : "white",
            }}>{l}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "20px 28px" }}>

        {/* VISÃO GERAL */}
        {tab === "geral" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 16, marginBottom: 16 }}>
              <Card style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: CORES.cinzaMedio, textTransform: "uppercase" }}>GrandMean</div>
                <Medidor valor={grandMean} />
                <div style={{ fontSize: 10, color: CORES.cinzaMedio, textAlign: "center", marginTop: 6 }}>Média das 6 dimensões<br />100 colaboradores</div>
              </Card>
              <Card>
                <SecTitle>Indicadores de Risco — {EMPRESA.total} Colaboradores</SecTitle>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
                  {[
                    { label: "Passivo anual estimado", val: fmt(PASSIVO.total), ref: "Turnover + Absenteísmo + Acidentes", cor: CORES.vermelho },
                    { label: "Custo mensal de inação", val: fmt(PASSIVO.mensal), ref: "R$25.050/mês perdidos silenciosamente", cor: CORES.vermelho },
                    { label: "Taxa de participação", val: "89%", ref: "89 de 100 colaboradores responderam", cor: CORES.verde },
                    { label: "Dimensão mais crítica", val: "D6 — 2.6", ref: "Segurança Psicológica", cor: CORES.vermelho },
                    { label: "Setor em alerta máximo", val: "Manutenção", ref: "GrandMean 2.5 — intervenção imediata", cor: CORES.vermelho },
                    { label: "Setor mais saudável", val: "Administrativo", ref: "GrandMean 3.9 — referência interna", cor: CORES.verde },
                  ].map((item, i) => (
                    <div key={i} style={{ background: CORES.cinzaClaro, borderRadius: 10, padding: "12px 14px", borderLeft: `3px solid ${item.cor}` }}>
                      <div style={{ fontSize: 10, color: CORES.cinzaMedio, marginBottom: 4, fontWeight: 500 }}>{item.label}</div>
                      <div style={{ fontSize: 20, fontWeight: 800, color: item.cor, lineHeight: 1 }}>{item.val}</div>
                      <div style={{ fontSize: 9, color: CORES.cinzaMedio, marginTop: 3 }}>{item.ref}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Card>
                <SecTitle>Status por Setor</SecTitle>
                {SETORES.map((s, i) => (
                  <div key={i} onClick={() => setTab("setores")} style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 8, marginBottom: 8, cursor: "pointer",
                    background: { verde: CORES.verdeClaro, amarelo: CORES.amareloClaro, vermelho: CORES.vermelhoClaro }[s.cor],
                  }}>
                    <StatusDot cor={s.cor} />
                    <span style={{ fontWeight: 600, fontSize: 13, flex: 1 }}>{s.nome}</span>
                    <span style={{ fontSize: 11, color: CORES.cinzaMedio }}>{s.colaboradores} pessoas</span>
                    <span style={{ fontSize: 20, fontWeight: 800, color: { verde: CORES.verde, amarelo: CORES.amarelo, vermelho: CORES.vermelho }[s.cor] }}>{s.grandMean.toFixed(1)}</span>
                  </div>
                ))}
              </Card>
              <Card>
                <SecTitle>As 6 Dimensões</SecTitle>
                {DIMENSOES.map((d, i) => (
                  <div key={i} style={{ marginBottom: 10, cursor: "pointer" }} onClick={() => setTab("dimensoes")}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                        <StatusDot cor={d.cor} size={9} />
                        <span style={{ fontSize: 12, fontWeight: 600 }}>{d.sigla} — {d.nome}</span>
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 800, color: { verde: CORES.verde, amarelo: CORES.amarelo, vermelho: CORES.vermelho }[d.cor] }}>{d.score.toFixed(1)}</span>
                    </div>
                    <Barra score={d.score} cor={d.cor} />
                  </div>
                ))}
              </Card>
            </div>
          </>
        )}

        {/* POR SETOR */}
        {tab === "setores" && (
          <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 16 }}>
            <Card>
              <SecTitle>Selecione o Setor</SecTitle>
              {SETORES.map((s, i) => (
                <div key={i} onClick={() => setSetorIdx(i)} style={{
                  padding: "11px 14px", borderRadius: 10, marginBottom: 8, cursor: "pointer",
                  background: setorIdx === i ? { verde: CORES.verdeClaro, amarelo: CORES.amareloClaro, vermelho: CORES.vermelhoClaro }[s.cor] : CORES.cinzaClaro,
                  border: `2px solid ${setorIdx === i ? { verde: CORES.verde, amarelo: CORES.amarelo, vermelho: CORES.vermelho }[s.cor] : "#E5E7EB"}`,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <StatusDot cor={s.cor} size={13} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>{s.nome}</div>
                      <div style={{ fontSize: 10, color: CORES.cinzaMedio }}>{s.colaboradores} de {EMPRESA.total} colaboradores</div>
                    </div>
                    <span style={{ fontSize: 22, fontWeight: 900, color: { verde: CORES.verde, amarelo: CORES.amarelo, vermelho: CORES.vermelho }[s.cor] }}>{s.grandMean.toFixed(1)}</span>
                  </div>
                </div>
              ))}
            </Card>
            <Card>
              {setorIdx !== null ? (() => {
                const s = SETORES[setorIdx];
                const corFill = { verde: CORES.verde, amarelo: CORES.amarelo, vermelho: CORES.vermelho }[s.cor];
                return (
                  <>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
                      <StatusDot cor={s.cor} size={18} />
                      <div>
                        <div style={{ fontSize: 20, fontWeight: 800 }}>{s.nome}</div>
                        <div style={{ fontSize: 12, color: CORES.cinzaMedio }}>{s.colaboradores} colaboradores ({Math.round(s.colaboradores/EMPRESA.total*100)}% da empresa) · GrandMean {s.grandMean.toFixed(1)}</div>
                      </div>
                    </div>
                    <SecTitle>Desempenho por Dimensão</SecTitle>
                    {DIMENSOES.map((d, i) => {
                      const delta = s.cor === "vermelho" ? -0.35 : s.cor === "amarelo" ? 0 : 0.25;
                      const sc = Math.min(5, Math.max(1, d.score + delta));
                      const c = sc >= 3.5 ? "verde" : sc >= 2.8 ? "amarelo" : "vermelho";
                      return (
                        <div key={i} style={{ marginBottom: 14 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                            <span style={{ fontSize: 12, fontWeight: 600 }}>{d.sigla} — {d.nome}</span>
                            <span style={{ fontSize: 14, fontWeight: 800, color: { verde: CORES.verde, amarelo: CORES.amarelo, vermelho: CORES.vermelho }[c] }}>{sc.toFixed(1)}</span>
                          </div>
                          <Barra score={sc} cor={c} />
                          <div style={{ fontSize: 10, color: CORES.cinzaMedio, marginTop: 3 }}>{d.descricao}</div>
                        </div>
                      );
                    })}
                  </>
                );
              })() : (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 280, color: CORES.cinzaMedio }}>
                  <div style={{ fontSize: 36, marginBottom: 10 }}>👈</div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>Selecione um setor para ver o detalhamento</div>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* 6 DIMENSÕES */}
        {tab === "dimensoes" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {DIMENSOES.map((d, i) => (
              <Card key={i} onClick={() => setDimIdx(dimIdx === i ? null : i)} style={{
                cursor: "pointer",
                border: `2px solid ${dimIdx === i ? { verde: CORES.verde, amarelo: CORES.amarelo, vermelho: CORES.vermelho }[d.cor] : "transparent"}`,
              }}>
                <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 9, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                    background: { verde: CORES.verdeClaro, amarelo: CORES.amareloClaro, vermelho: CORES.vermelhoClaro }[d.cor],
                    fontSize: 12, fontWeight: 800, color: { verde: CORES.verde, amarelo: CORES.amarelo, vermelho: CORES.vermelho }[d.cor],
                  }}>{d.sigla}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{d.nome}</div>
                    <div style={{ fontSize: 10, color: CORES.cinzaMedio, marginTop: 2 }}>{d.descricao}</div>
                  </div>
                  <div style={{ fontSize: 26, fontWeight: 900, color: { verde: CORES.verde, amarelo: CORES.amarelo, vermelho: CORES.vermelho }[d.cor] }}>{d.score.toFixed(1)}</div>
                </div>
                <Barra score={d.score} cor={d.cor} />
                {dimIdx === i && (
                  <div style={{ marginTop: 14, padding: "11px 13px", background: CORES.cinzaClaro, borderRadius: 8 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: CORES.verdeMarca, marginBottom: 6 }}>O que este score indica para {EMPRESA.total} colaboradores:</div>
                    {d.score < 2.8 && <div style={{ fontSize: 11, color: CORES.vermelho }}>⚠️ <strong>Zona crítica</strong> — Ação imediata recomendada. Risco real de incidentes, turnover acelerado e queda de produtividade.</div>}
                    {d.score >= 2.8 && d.score < 3.5 && <div style={{ fontSize: 11, color: CORES.amarelo }}>⚡ <strong>Zona de atenção</strong> — Funcional, mas abaixo do potencial. Intervenção planejada gera ganho significativo.</div>}
                    {d.score >= 3.5 && <div style={{ fontSize: 11, color: CORES.verde }}>✅ <strong>Zona saudável</strong> — Manter e monitorar. Ponto de força a preservar durante transformações.</div>}
                    <div style={{ marginTop: 8, fontSize: 10, color: CORES.cinzaMedio }}>
                      <strong>Passivo associado:</strong>{" "}
                      {d.score < 2.8 ? `~R$${(PASSIVO.total * 0.37 / 1000).toFixed(0)}k — maior contribuinte do passivo total.` :
                       d.score < 3.5 ? `~R$${(PASSIVO.total * 0.20 / 1000).toFixed(0)}k — contribuinte moderado do passivo total.` :
                       `Abaixo de R$${(PASSIVO.total * 0.10 / 1000).toFixed(0)}k — impacto baixo no passivo total.`}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* PASSIVO */}
        {tab === "passivo" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Card>
              <SecTitle>Cálculo do Passivo Evitável — {EMPRESA.total} Colaboradores</SecTitle>
              {[
                { label: "Turnover", valor: PASSIVO.turnover.valor, desc: PASSIVO.turnover.descricao, cor: "vermelho" },
                { label: "Absenteísmo", valor: PASSIVO.absenteismo.valor, desc: PASSIVO.absenteismo.descricao, cor: "vermelho" },
                { label: "Acidentes", valor: PASSIVO.acidentes.valor, desc: PASSIVO.acidentes.descricao, cor: "amarelo" },
              ].map((item, i) => (
                <div key={i} style={{ padding: "12px 14px", borderRadius: 10, marginBottom: 10, background: CORES.cinzaClaro, borderLeft: `3px solid ${item.cor === "vermelho" ? CORES.vermelho : CORES.amarelo}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>{item.label}</div>
                      <div style={{ fontSize: 10, color: CORES.cinzaMedio, marginTop: 3 }}>{item.desc}</div>
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: item.cor === "vermelho" ? CORES.vermelho : CORES.amarelo }}>{fmt(item.valor)}</div>
                  </div>
                </div>
              ))}
              <div style={{ padding: "14px 16px", borderRadius: 10, background: CORES.vermelhoClaro, border: `2px solid ${CORES.vermelho}`, marginTop: 4 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 14, color: CORES.vermelho }}>PASSIVO TOTAL ANUAL</div>
                    <div style={{ fontSize: 10, color: CORES.cinzaMedio, marginTop: 2 }}>= {fmt(PASSIVO.mensal)}/mês rodando silenciosamente</div>
                  </div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: CORES.vermelho }}>{fmt(PASSIVO.total)}</div>
                </div>
              </div>
            </Card>
            <Card>
              <SecTitle>Projeção de ROI — Diagnóstico IBEP-4.0</SecTitle>
              <div style={{ marginBottom: 16, padding: "10px 14px", background: CORES.cinzaClaro, borderRadius: 8, fontSize: 11, color: CORES.cinzaMedio }}>
                Investimento no Diagnóstico (Starter): <strong style={{ color: CORES.verdeMarca }}>R$11.900</strong>
              </div>
              {[
                { cenario: "Conservador", reducao: "15%", economia: Math.round(PASSIVO.total * 0.15), roi: Math.round((PASSIVO.total * 0.15 / 11900 - 1) * 100) },
                { cenario: "Moderado", reducao: "30%", economia: Math.round(PASSIVO.total * 0.30), roi: Math.round((PASSIVO.total * 0.30 / 11900 - 1) * 100) },
                { cenario: "Otimista", reducao: "50%", economia: Math.round(PASSIVO.total * 0.50), roi: Math.round((PASSIVO.total * 0.50 / 11900 - 1) * 100) },
              ].map((r, i) => (
                <div key={i} style={{ padding: "12px 14px", borderRadius: 10, marginBottom: 10, background: i === 1 ? CORES.verdeClaro : CORES.cinzaClaro, border: i === 1 ? `1.5px solid ${CORES.verde}` : "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 12 }}>{r.cenario} ({r.reducao} de redução)</div>
                      <div style={{ fontSize: 10, color: CORES.cinzaMedio }}>Economia: {fmt(r.economia)}/ano</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 22, fontWeight: 900, color: CORES.verde }}>+{r.roi}%</div>
                      <div style={{ fontSize: 9, color: CORES.cinzaMedio }}>ROI no 1º ano</div>
                    </div>
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 12, padding: "10px 14px", background: "#EEF2FF", borderRadius: 8, fontSize: 10, color: CORES.azulMarca }}>
                <strong>Metodologia:</strong> Passivo calculado via SHRM (2022): turnover × 1,5× salário médio; absenteísmo × 50% evitável; acidentes × benchmark SESMT/INSS.
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ background: CORES.verdeMarca, padding: "10px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 10, color: "#86efac" }}>
        <span>Anderson Raimundo de Carvalho — Sistema 4.0</span>
        <span style={{ color: "white", fontWeight: 600 }}>{EMPRESA.nome} · {EMPRESA.total} colaboradores · Diagnóstico IBEP-4.0</span>
        <span>Comunicação Estratégica · PUCRS · Gallup CliftonStrengths</span>
      </div>
    </div>
  );
}
