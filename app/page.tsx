"use client";
import React, { useState } from "react";

export default function Page() {
  const [formData, setFormData] = useState({
    location: "", price: "", rooms: "", size: "", floor: "",
    totalFloors: "", buildingAge: "", furnished: "", features: "",
    siteFeatures: "", nearby: "", listingType: "Satılık", tone: "Profesyonel"
  });
  const [generatedText, setGeneratedText] = useState({
    title: "", short: "", long: "", social: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerate = async () => {
    setLoading(true);
    const prompt = `Türkçe olarak şunları üret:\n1. Dikkat çekici bir ilan başlığı.\n2. Kısa bir açıklama (sahibinden için).\n3. Uzun açıklama (tüm detaylarıyla).\n4. Sosyal medya için kısa ve etkileyici bir metin.\n\nBilgiler:\n- Tür: ${formData.listingType}\n- Oda: ${formData.rooms}\n- m²: ${formData.size}\n- Konum: ${formData.location}\n- Fiyat: ${formData.price}\n- Kat: ${formData.floor}/${formData.totalFloors}\n- Bina Yaşı: ${formData.buildingAge}\n- Eşyalı mı: ${formData.furnished}\n- Özellikler: ${formData.features}\n- Site Özellikleri: ${formData.siteFeatures}\n- Yakınlar: ${formData.nearby}\n- Ton: ${formData.tone}`;

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();
    const parts = data.result.split("\n\n");
    setGeneratedText({
      title: parts[0] || "", short: parts[1] || "", long: parts[2] || "", social: parts[3] || "",
    });
    setLoading(false);
  };

  return (
    <main style={{ padding: 24, maxWidth: 800, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, fontWeight: 600 }}>Filizbot – Akıllı Emlak İlanı Oluşturucu</h1>
      <div style={{ marginTop: 16 }}>
        {["location", "price", "rooms", "size", "floor", "totalFloors", "buildingAge", "furnished", "features", "siteFeatures", "nearby"].map((field) => (
          <input key={field} name={field} placeholder={field} onChange={handleChange} style={{ display: "block", margin: "6px 0", padding: 8, width: "100%" }} />
        ))}
        <select onChange={(e) => setFormData({ ...formData, listingType: e.target.value })}>
          <option value="Satılık">Satılık</option>
          <option value="Kiralık">Kiralık</option>
        </select>
        <select onChange={(e) => setFormData({ ...formData, tone: e.target.value })}>
          <option value="Profesyonel">Profesyonel</option>
          <option value="Samimi">Samimi</option>
          <option value="Yatırımcı Odaklı">Yatırımcı Odaklı</option>
          <option value="Aile Dostu">Aile Dostu</option>
        </select>
        <button onClick={handleGenerate} disabled={loading} style={{ marginTop: 12 }}>
          {loading ? "Oluşturuluyor..." : "İlanı Oluştur"}
        </button>
      </div>
      {generatedText.title && (
        <div style={{ marginTop: 20 }}>
          <h2>📌 Başlık</h2><p>{generatedText.title}</p>
          <h2>📝 Kısa Açıklama</h2><p>{generatedText.short}</p>
          <h2>📃 Uzun Açıklama</h2><p>{generatedText.long}</p>
          <h2>📱 Sosyal Medya Metni</h2><p>{generatedText.social}</p>
        </div>
      )}
    </main>
  );
}
