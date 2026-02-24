import { useState, useMemo, useRef } from "react";

const defaultItems = [
  { id: 1, dept: "GROCERY", name: "GV WHOLE MILK 1GAL", qty: 1, price: 3.98, tax: "N", save: 0 },
  { id: 2, dept: "GROCERY", name: "GREAT VALUE BREAD", qty: 2, price: 1.28, tax: "N", save: 0.5 },
  { id: 3, dept: "HOUSEHOLD", name: "TIDE PODS 42CT", qty: 1, price: 12.97, tax: "X", save: 0 },
  { id: 4, dept: "PRODUCE", name: "BANANAS 2.4 LB", qty: 1, price: 1.04, tax: "N", save: 0 },
  { id: 5, dept: "DAIRY", name: "DANNON YOGURT 6PK", qty: 2, price: 3.48, tax: "N", save: 1.0 },
];

const DEPTS = ["GROCERY", "PRODUCE", "DAIRY", "BAKERY", "FROZEN", "HOUSEHOLD", "CLOTHING", "ELECTRONICS", "PHARMACY", "GARDEN", "GENERAL MERCH"];
const TAX_CODES = ["N", "X", "O"];
const PAY_METHODS = ["VISA", "MASTERCARD", "AMEX", "DEBIT", "CASH", "EBT"];
const rnd = (n, len) => Array.from({ length: len }, () => Math.floor(Math.random() * n)).join("");

const RRow = ({ left, right, bold, size = 12, dim }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      fontFamily: "'Courier New',monospace",
      fontSize: size,
      fontWeight: bold ? 700 : 400,
      lineHeight: 1.65,
    }}
  >
    <span
      style={{
        color: dim ? "#777" : "#111",
        flexShrink: 1,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        paddingRight: 8,
      }}
    >
      {left}
    </span>
    <span style={{ color: dim ? "#777" : "#111", flexShrink: 0, whiteSpace: "nowrap" }}>{right}</span>
  </div>
);
const Ln = () => <div style={{ borderBottom: "1px dashed #bbb", margin: "5px 0" }} />;
const DLn = () => <div style={{ borderBottom: "3px double #333", margin: "5px 0" }} />;

const Barcode = () => {
  const bars = useMemo(
    () =>
      Array.from({ length: 72 }, (_, i) => ({
        w: i % 5 === 0 ? 3 : i % 3 === 0 ? 2 : 1,
        h: i % 9 === 0 ? 38 : 28,
      })),
    []
  );
  return (
    <div
      style={{
        display: "flex",
        gap: 1,
        justifyContent: "center",
        alignItems: "flex-end",
        margin: "10px 0 2px",
      }}
    >
      {bars.map((b, i) => (
        <div key={i} style={{ width: b.w, height: b.h, background: "#111", flexShrink: 0 }} />
      ))}
    </div>
  );
};

const loadHtml2Canvas = () =>
  new Promise((resolve, reject) => {
    if (window.html2canvas) return resolve(window.html2canvas);
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
    s.onload = () => resolve(window.html2canvas);
    s.onerror = () => reject(new Error("Failed to load html2canvas"));
    document.head.appendChild(s);
  });

export default function App() {
  const receiptRef = useRef(null);
  const [store, setStore] = useState("Walmart");
  const [tagline, setTagline] = useState("Save Money. Live Better.");
  const [manager, setManager] = useState("JENNIFER RODRIGUEZ");
  const [address, setAddress] = useState("2501 SE J St");
  const [city, setCity] = useState("Bentonville, AR 72712");
  const [phone, setPhone] = useState("479-273-4000");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState(new Date().toTimeString().slice(0, 5));
  const [taxRate, setTaxRate] = useState(8.5);
  const [payMethod, setPayMethod] = useState("DEBIT");
  const [cardLast4, setCardLast4] = useState("4321");
  const [footer, setFooter] = useState("THANK YOU FOR SHOPPING AT WALMART!");
  const [items, setItems] = useState(defaultItems);
  const [nextId, setNextId] = useState(20);
  const [jpgLoading, setJpgLoading] = useState(false);

  const [stNum] = useState(() => rnd(9, 4));
  const [opNum] = useState(() => "0" + rnd(9, 4));
  const [teNum] = useState(() => String(Math.floor(Math.random() * 9) + 1));
  const [trNum] = useState(() => rnd(9, 4));
  const [refNum] = useState(() => rnd(9, 8));
  const [tcNum] = useState(
    () =>
      Array.from({ length: 20 }, () => Math.floor(Math.random() * 10))
        .join("")
        .replace(/(.{4})/g, "$1 ")
        .trim()
  );

  const taxableSub = items.filter((i) => i.tax === "X").reduce((s, i) => s + i.qty * i.price, 0);
  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0);
  const totalSave = items.reduce((s, i) => s + (parseFloat(i.save) || 0), 0);
  const tax = taxableSub * (taxRate / 100);
  const total = subtotal + tax;

  const addItem = () => {
    setItems([...items, { id: nextId, dept: "GROCERY", name: "NEW ITEM", qty: 1, price: 0, tax: "N", save: 0 }]);
    setNextId(nextId + 1);
  };
  const removeItem = (id) => setItems(items.filter((i) => i.id !== id));
  const upd = (id, field, val) =>
    setItems(items.map((i) => (i.id === id ? { ...i, [field]: ["name", "tax", "dept"].includes(field) ? val : parseFloat(val) || 0 } : i)));

  const fmt = (n) => `$${n.toFixed(2)}`;
  const fmtDate = (d) => {
    if (!d) return "";
    const [y, m, day] = d.split("-");
    return `${m}/${day}/${y.slice(2)}`;
  };
  const fmtTime = (t) => {
    if (!t) return "";
    const [h, m] = t.split(":");
    const hr = parseInt(h, 10);
    return `${hr % 12 || 12}:${m} ${hr >= 12 ? "PM" : "AM"}`;
  };

  const grouped = useMemo(() => {
    const map = {};
    items.forEach((i) => {
      if (!map[i.dept]) map[i.dept] = [];
      map[i.dept].push(i);
    });
    return map;
  }, [items]);

  const handlePrintPDF = () => {
    const style = document.createElement("style");
    style.id = "__receipt_print__";
    style.innerHTML = `
      @media print {
        @page { margin: 0; size: 80mm auto; }
        body * { visibility: hidden; }
        #__receipt_root__, #__receipt_root__ * { visibility: visible; }
        #__receipt_root__ { position: fixed; top: 0; left: 0; width: 100%; padding: 0; background: #fff; }
        #__receipt_root__ > *:not(#__receipt_printable__) { display: none !important; }
        #__receipt_printable__ { display: block !important; visibility: visible; }
      }
    `;
    document.head.appendChild(style);
    window.print();
    setTimeout(() => {
      const el = document.getElementById("__receipt_print__");
      if (el) el.remove();
    }, 1000);
  };

  const handleDownloadJPG = async () => {
    if (!receiptRef.current) return;
    setJpgLoading(true);
    try {
      const h2c = await loadHtml2Canvas();
      const canvas = await h2c(receiptRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });
      const link = document.createElement("a");
      link.download = `receipt-${Date.now()}.jpg`;
      link.href = canvas.toDataURL("image/jpeg", 0.95);
      link.click();
    } catch (e) {
      alert("Could not generate image: " + e.message);
    }
    setJpgLoading(false);
  };

  const inputSt = {
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-sm)",
    padding: "10px 12px",
    fontSize: 14,
    width: "100%",
    boxSizing: "border-box",
    background: "var(--color-surface)",
    color: "var(--color-text)",
    transition: "border-color var(--transition), box-shadow var(--transition)",
  };
  const inputFocus = { borderColor: "var(--color-border-focus)", boxShadow: "0 0 0 3px var(--color-primary-muted)" };
  const lbl = (txt) => (
    <label style={{ fontSize: 11, color: "var(--color-text-muted)", marginBottom: 6, display: "block", fontWeight: 600, letterSpacing: "0.02em" }}>
      {txt}
    </label>
  );

  const btnBase = {
    border: "none",
    borderRadius: "var(--radius-md)",
    padding: "12px 16px",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    width: "100%",
    transition: "background var(--transition), transform var(--transition)",
  };

  const Receipt = () => (
    <div
      ref={receiptRef}
      style={{
        background: "#fff",
        width: 300,
        boxSizing: "border-box",
        padding: "20px 18px 28px",
        fontFamily: "'Courier New', 'Lucida Console', monospace",
        boxShadow: "inset 0 0 60px rgba(0,0,0,0.02)",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 10 }}>
        <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: 4, lineHeight: 1.2 }}>{store}</div>
        <div style={{ fontSize: 10, color: "#555", marginTop: 2, letterSpacing: 1 }}>{tagline}</div>
        <div style={{ fontSize: 11, marginTop: 6, lineHeight: 1.7 }}>
          <div>ST MGR {manager}</div>
          <div>{address}</div>
          <div>{city}</div>
          <div>{phone}</div>
        </div>
        <div style={{ fontSize: 10, marginTop: 5, letterSpacing: 0.5 }}>
          ST# {stNum} OP# {opNum} TE# {teNum} TR# {trNum}
        </div>
      </div>

      <Ln />

      <div style={{ margin: "6px 0" }}>
        {Object.entries(grouped).map(([dept, dItems]) => (
          <div key={dept}>
            <div style={{ fontSize: 10, color: "#888", margin: "7px 0 3px", letterSpacing: 1 }}>{dept}</div>
            {dItems.map((item) => (
              <div key={item.id} style={{ marginBottom: 5 }}>
                <RRow left={item.name} right={`$${(item.qty * item.price).toFixed(2)} ${item.tax}`} />
                {item.qty > 1 && (
                  <div style={{ fontSize: 10, color: "#555", paddingLeft: 4 }}>
                    {item.qty} @ ${item.price.toFixed(2)} EA
                  </div>
                )}
                {item.save > 0 && <RRow left="   **** SAVE" right={`$${item.save.toFixed(2)}`} dim size={11} />}
              </div>
            ))}
          </div>
        ))}
      </div>

      <Ln />

      <div style={{ margin: "6px 0" }}>
        <RRow left="SUBTOTAL" right={fmt(subtotal)} />
        <RRow left={`TAX 1  ${taxRate}%  X`} right={fmt(tax)} />
        {totalSave > 0 && <RRow left="YOU SAVED TODAY" right={fmt(totalSave)} dim />}
      </div>

      <DLn />
      <RRow left="TOTAL" right={fmt(total)} bold size={16} />
      <DLn />

      <div style={{ margin: "8px 0" }}>
        <RRow left={`${payMethod} TEND`} right={fmt(total)} bold />
        <RRow left={payMethod} right={fmt(total)} />
        {payMethod !== "CASH" && (
          <>
            <div style={{ fontSize: 12, color: "#555" }}>  ****{cardLast4}</div>
            <div style={{ fontSize: 10, color: "#555" }}>  REF # {refNum}</div>
          </>
        )}
        <RRow left="CHANGE DUE" right="$0.00" />
      </div>

      <Ln />

      <div style={{ textAlign: "center", margin: "6px 0", fontSize: 11 }}>
        <div># ITEMS SOLD {items.reduce((s, i) => s + i.qty, 0)}</div>
        <div style={{ marginTop: 2 }}>
          {fmtDate(date)}  {fmtTime(time)}
        </div>
      </div>

      <Ln />

      <div style={{ textAlign: "center", fontWeight: 700, fontSize: 11, margin: "8px 4px", lineHeight: 1.6, whiteSpace: "normal" }}>{footer}</div>
      <div style={{ textAlign: "center", fontSize: 10, color: "#555", margin: "4px 0" }}>TC# {tcNum}</div>

      <Barcode />

      <div style={{ textAlign: "center", fontSize: 10, color: "#555", letterSpacing: 2 }}>
        {stNum} {opNum} {teNum} {trNum}
      </div>
      <div style={{ textAlign: "center", fontSize: 9, color: "#bbb", marginTop: 8 }}>Low Price You Can Count On Everyday!</div>
    </div>
  );

  const Section = ({ title, children }) => (
    <div style={{
      background: "var(--color-surface)",
      borderRadius: "var(--radius-lg)",
      padding: 20,
      boxShadow: "var(--shadow-md)",
      marginBottom: 20,
    }}>
      <h3 style={{
        fontSize: 13,
        fontWeight: 600,
        color: "var(--color-text)",
        margin: "0 0 16px 0",
        letterSpacing: "0.02em",
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}>
        <span style={{
          width: 4,
          height: 18,
          borderRadius: 2,
          background: "var(--color-primary)",
        }} />
        {title}
      </h3>
      {children}
    </div>
  );

  return (
    <div id="__receipt_root__" style={{
      minHeight: "100vh",
      background: "var(--color-bg)",
      padding: "24px 16px 40px",
    }}>
      {/* Printable receipt - direct child for print CSS */}
      <div id="__receipt_printable__" style={{ display: "none" }}>
        <Receipt />
      </div>

      {/* Header */}
      <header style={{
        textAlign: "center",
        marginBottom: 32,
        maxWidth: 600,
        marginLeft: "auto",
        marginRight: "auto",
      }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 8,
        }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: "var(--radius-md)",
            background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            color: "#fff",
          }}>🧾</div>
          <h1 style={{
            fontSize: 24,
            fontWeight: 700,
            color: "var(--color-text)",
            margin: 0,
            letterSpacing: "-0.02em",
          }}>
            Receipt Generator
          </h1>
        </div>
        <p style={{
          fontSize: 14,
          color: "var(--color-text-muted)",
          margin: 0,
          lineHeight: 1.5,
        }}>
          Create Walmart-style thermal receipts. Edit below and export as JPG or PDF.
        </p>
      </header>

      <div style={{
        display: "flex",
        gap: 24,
        maxWidth: 1100,
        margin: "0 auto",
        flexWrap: "wrap",
        alignItems: "flex-start",
      }}>
        {/* Editor */}
        <div style={{ flex: "1 1 380px", minWidth: 0 }}>
          <Section title="Store Details">
            <div style={{ display: "grid", gap: 14 }}>
              {[
                [store, setStore, "Store Name"],
                [tagline, setTagline, "Tagline"],
                [manager, setManager, "Store Manager"],
                [address, setAddress, "Street Address"],
                [city, setCity, "City, State ZIP"],
                [phone, setPhone, "Phone"],
              ].map(([v, s, l]) => (
                <div key={l}>
                  {lbl(l)}
                  <input
                    style={inputSt}
                    value={v}
                    onChange={(e) => s(e.target.value)}
                    onFocus={(e) => Object.assign(e.target.style, inputFocus)}
                    onBlur={(e) => { e.target.style.borderColor = ""; e.target.style.boxShadow = ""; }}
                  />
                </div>
              ))}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  {lbl("Date")}
                  <input type="date" style={inputSt} value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
                <div>
                  {lbl("Time")}
                  <input type="time" style={inputSt} value={time} onChange={(e) => setTime(e.target.value)} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
                <div>
                  {lbl("Tax %")}
                  <input type="number" style={inputSt} value={taxRate} onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)} />
                </div>
                <div>
                  {lbl("Payment")}
                  <select style={inputSt} value={payMethod} onChange={(e) => setPayMethod(e.target.value)}>
                    {PAY_METHODS.map((p) => (
                      <option key={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  {lbl("Last 4")}
                  <input style={inputSt} maxLength={4} value={cardLast4} onChange={(e) => setCardLast4(e.target.value)} placeholder="••••" />
                </div>
              </div>
            </div>
          </Section>

          <Section title="Line Items">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <span style={{ fontSize: 12, color: "var(--color-text-muted)" }}>{items.length} items</span>
              <button
                onClick={addItem}
                style={{
                  ...btnBase,
                  background: "var(--color-primary)",
                  color: "#fff",
                  width: "auto",
                  padding: "8px 16px",
                  fontSize: 13,
                }}
                onMouseOver={(e) => { e.target.style.background = "var(--color-primary-hover)"; }}
                onMouseOut={(e) => { e.target.style.background = "var(--color-primary)"; }}
              >
                + Add Item
              </button>
            </div>
            <div style={{
              display: "grid",
              gridTemplateColumns: "90px 1fr 48px 64px 44px 52px 40px",
              gap: 8,
              marginBottom: 8,
              paddingBottom: 8,
              borderBottom: "1px solid var(--color-border)",
            }}>
              {["Dept", "Name", "Qty", "Price", "Tax", "Save", ""].map((h) => (
                <span key={h} style={{ fontSize: 10, color: "var(--color-text-subtle)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.03em" }}>
                  {h}
                </span>
              ))}
            </div>
            <div className="items-scroll" style={{ maxHeight: 280, overflowY: "auto" }}>
              {items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "90px 1fr 48px 64px 44px 52px 40px",
                    gap: 8,
                    marginBottom: 8,
                    alignItems: "center",
                    padding: "6px 0",
                    borderRadius: "var(--radius-sm)",
                    transition: "background var(--transition)",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-primary-muted)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                >
                  <select
                    style={{ ...inputSt, padding: "8px 8px", fontSize: 11 }}
                    value={item.dept}
                    onChange={(e) => upd(item.id, "dept", e.target.value)}
                  >
                    {DEPTS.map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                  <input
                    style={{ ...inputSt, padding: "8px 10px", fontSize: 12, textTransform: "uppercase" }}
                    value={item.name}
                    onChange={(e) => upd(item.id, "name", e.target.value)}
                  />
                  <input
                    type="number"
                    style={{ ...inputSt, padding: "8px 6px", fontSize: 12 }}
                    value={item.qty}
                    min={1}
                    onChange={(e) => upd(item.id, "qty", e.target.value)}
                  />
                  <input
                    type="number"
                    style={{ ...inputSt, padding: "8px 6px", fontSize: 12 }}
                    value={item.price}
                    step="0.01"
                    onChange={(e) => upd(item.id, "price", e.target.value)}
                  />
                  <select
                    style={{ ...inputSt, padding: "8px 4px", fontSize: 11 }}
                    value={item.tax}
                    onChange={(e) => upd(item.id, "tax", e.target.value)}
                  >
                    {TAX_CODES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    style={{ ...inputSt, padding: "8px 6px", fontSize: 11 }}
                    value={item.save}
                    step="0.01"
                    onChange={(e) => upd(item.id, "save", e.target.value)}
                  />
                  <button
                    onClick={() => removeItem(item.id)}
                    style={{
                      background: "var(--color-danger-bg)",
                      color: "var(--color-danger)",
                      border: "none",
                      borderRadius: "var(--radius-sm)",
                      width: 36,
                      height: 36,
                      cursor: "pointer",
                      fontSize: 16,
                      fontWeight: 600,
                      lineHeight: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "background var(--transition)",
                    }}
                    onMouseOver={(e) => { e.target.style.background = "#fecaca"; }}
                    onMouseOut={(e) => { e.target.style.background = "var(--color-danger-bg)"; }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 11, color: "var(--color-text-subtle)", marginTop: 12, lineHeight: 1.4 }}>
              Tax: N=none · X=taxable · O=other · Save=discount amount
            </div>
          </Section>

          <Section title="Footer">
            {lbl("Thank You Message")}
            <input style={inputSt} value={footer} onChange={(e) => setFooter(e.target.value)} placeholder="THANK YOU FOR SHOPPING!" />
          </Section>
        </div>

        {/* Preview */}
        <div style={{
          flex: "0 0 360px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "sticky",
          top: 24,
        }}>
          <div style={{
            fontSize: 13,
            fontWeight: 600,
            color: "var(--color-text)",
            marginBottom: 16,
            alignSelf: "flex-start",
          }}>
            Receipt Preview
          </div>

          {/* Paper effect wrapper */}
          <div style={{
            boxShadow: "var(--shadow-receipt)",
            borderRadius: 4,
            overflow: "hidden",
            background: "linear-gradient(180deg, #fafafa 0%, #fff 8%)",
            padding: 12,
            position: "relative",
          }}>
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 1,
              background: "linear-gradient(90deg, transparent, rgba(0,0,0,0.06), transparent)",
            }} />
            <Receipt />
          </div>

          {/* Summary card */}
          <div style={{
            width: "100%",
            maxWidth: 320,
            marginTop: 20,
            padding: 16,
            background: "var(--color-surface)",
            borderRadius: "var(--radius-md)",
            boxShadow: "var(--shadow-sm)",
            border: "1px solid var(--color-border)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13, color: "var(--color-text-muted)" }}>
              <span>Subtotal</span>
              <span>{fmt(subtotal)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13, color: "var(--color-text-muted)" }}>
              <span>Tax</span>
              <span>{fmt(tax)}</span>
            </div>
            {totalSave > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13, color: "var(--color-success)" }}>
                <span>You Saved</span>
                <span>{fmt(totalSave)}</span>
              </div>
            )}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              paddingTop: 12,
              marginTop: 8,
              borderTop: "2px solid var(--color-border)",
              fontSize: 16,
              fontWeight: 700,
              color: "var(--color-text)",
            }}>
              <span>Total</span>
              <span>{fmt(total)}</span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 20, width: "100%", maxWidth: 320 }}>
            <button
              onClick={handleDownloadJPG}
              disabled={jpgLoading}
              style={{
                ...btnBase,
                background: jpgLoading ? "var(--color-text-subtle)" : "var(--color-success)",
                color: "#fff",
              }}
              onMouseOver={(e) => { if (!jpgLoading) e.target.style.background = "#047857"; }}
              onMouseOut={(e) => { if (!jpgLoading) e.target.style.background = "var(--color-success)"; }}
            >
              {jpgLoading ? "Generating…" : "Download JPG"}
            </button>
            <button
              onClick={handlePrintPDF}
              style={{
                ...btnBase,
                background: "var(--color-primary)",
                color: "#fff",
              }}
              onMouseOver={(e) => { e.target.style.background = "var(--color-primary-hover)"; }}
              onMouseOut={(e) => { e.target.style.background = "var(--color-primary)"; }}
            >
              Print / Save PDF
            </button>
          </div>
          <div style={{ fontSize: 12, color: "var(--color-text-subtle)", marginTop: 12, textAlign: "center", lineHeight: 1.4 }}>
            Use "Save as PDF" in the print dialog to export
          </div>
        </div>
      </div>
    </div>
  );
}
