import os
import json
from typing import Optional, Literal

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv

from google import genai
from google.genai import types

# ---------------------------------------------------------
#  .env dosyasını yükle (GOOGLE_API_KEY buradan gelecek)
# ---------------------------------------------------------
load_dotenv()

# Google Gemini client
client = genai.Client(api_key=os.environ.get("GOOGLE_API_KEY"))

# ---------------------------------------------------------
#  FastAPI uygulaması
# ---------------------------------------------------------
app = FastAPI(title="AdAPT AI Backend")

# ---------------------------------------------------------
#  Pydantic veri modelleri (request / response şemaları)
# ---------------------------------------------------------


class CreativeRequest(BaseModel):
    reference_image_url: str
    product_image_url: str
    brand_logo_url: Optional[str] = None
    brand_name: str
    campaign_goal: Literal["traffic", "conversion", "awareness"]


class CreativeResponse(BaseModel):
    headline: str
    primary_text: str
    cta: str
    generated_image_url: str  # şimdilik placeholder URL


# ---------------------------------------------------------
#  Ana endpoint: /generate-creative  (mock görsel + gerçek metin)
# ---------------------------------------------------------
@app.post("/generate-creative", response_model=CreativeResponse)
async def generate_creative(request: CreativeRequest):
    """
    Metni Gemini ile üretiyoruz, görseli şimdilik placeholder URL olarak döndürüyoruz.
    Görsel indirme / image model çağrısı yok (quota yememek için).
    """
    try:
        # --- GÖREV A: Metin Üretimi (Copywriting) ---
        copy_prompt = f"""
        Sen uzman bir reklam yazarısın. 
        Marka: {request.brand_name}
        Hedef: {request.campaign_goal}
        
        Lütfen bu kampanya için Türkçe bir reklam metni seti hazırla.
        Çıktı JSON formatında olmalı ve şu alanları içermeli: 'headline', 'primary_text', 'cta'.
        """

        text_response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=copy_prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema={
                    "type": "OBJECT",
                    "properties": {
                        "headline": {"type": "STRING"},
                        "primary_text": {"type": "STRING"},
                        "cta": {"type": "STRING"},
                    },
                    "required": ["headline", "primary_text", "cta"],
                },
            ),
        )

        try:
            ad_copy = json.loads(text_response.text)
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Metin JSON parse hatası: {e}",
            )

        # --- GÖREV B: Görsel (GEÇİCİ MOCK) ---
        # Şimdilik sabit bir placeholder görsel kullanıyoruz.
        placeholder_image_url = "https://picsum.photos/seed/refmorph-demo/800/800"

        return CreativeResponse(
            headline=ad_copy.get("headline", "Demo headline"),
            primary_text=ad_copy.get("primary_text", "Demo primary text"),
            cta=ad_copy.get("cta", "Şimdi İncele"),
            generated_image_url=placeholder_image_url,
        )

    except HTTPException:
        # Zaten fırlattığımız HTTPException'ı olduğu gibi yukarı taşı
        raise
    except Exception as e:
        # Diğer tüm hatalar
        raise HTTPException(status_code=500, detail=str(e))
