'use client';

import React, { useState } from 'react';

type CampaignGoal = 'traffic' | 'conversion' | 'awareness';

interface CreativeResult {
  headline: string;
  primary_text: string;
  cta: string;
  generated_image_url: string;
}

interface FormData {
  referenceImageUrl: string;
  productImageUrl: string;
  brandLogoUrl: string;
  brandName: string;
  campaignGoal: CampaignGoal;
}

export default function Home() {
  const [formData, setFormData] = useState<FormData>({
    referenceImageUrl: '',
    productImageUrl: '',
    brandLogoUrl: '',
    brandName: '',
    campaignGoal: 'conversion',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creative, setCreative] = useState<CreativeResult | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (
      !formData.referenceImageUrl.trim() ||
      !formData.productImageUrl.trim() ||
      !formData.brandName.trim()
    ) {
      setError('Please fill in all required fields (Reference Image, Product Image, Brand Name).');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    setIsLoading(true);
    setCreative(null);

    try {
      const response = await fetch('/api/generate-creative', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reference_image_url: formData.referenceImageUrl,
          product_image_url: formData.productImageUrl,
          brand_logo_url: formData.brandLogoUrl || null,
          brand_name: formData.brandName,
          campaign_goal: formData.campaignGoal,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.details || errData.error || 'Failed to generate creative');
      }

      const data: CreativeResult = await response.json();
      setCreative(data);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl">
        
        {/* Left Column: Input Form */}
        <div className="flex flex-col gap-6 bg-slate-900/50 p-8 rounded-xl border border-slate-800 shadow-xl">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Refmorph Studio</h1>
            <p className="text-slate-400 text-sm">
              Generate high-performing ad creatives by morphing your product into winning references.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-900/50 border border-red-700 text-red-200 text-sm rounded">
                {error}
              </div>
            )}

            <div className="space-y-1">
              <label htmlFor="referenceImageUrl" className="block text-sm font-medium text-slate-300">
                Reference Image URL <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="referenceImageUrl"
                name="referenceImageUrl"
                value={formData.referenceImageUrl}
                onChange={handleChange}
                placeholder="https://example.com/winning-ad.jpg"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="productImageUrl" className="block text-sm font-medium text-slate-300">
                Product Image URL <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="productImageUrl"
                name="productImageUrl"
                value={formData.productImageUrl}
                onChange={handleChange}
                placeholder="https://example.com/my-product.png"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="brandLogoUrl" className="block text-sm font-medium text-slate-300">
                Brand Logo URL <span className="text-slate-500 text-xs">(Optional)</span>
              </label>
              <input
                type="text"
                id="brandLogoUrl"
                name="brandLogoUrl"
                value={formData.brandLogoUrl}
                onChange={handleChange}
                placeholder="https://example.com/logo.png"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="brandName" className="block text-sm font-medium text-slate-300">
                  Brand Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="brandName"
                  name="brandName"
                  value={formData.brandName}
                  onChange={handleChange}
                  placeholder="Acme Corp"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="campaignGoal" className="block text-sm font-medium text-slate-300">
                  Campaign Goal
                </label>
                <div className="relative">
                  <select
                    id="campaignGoal"
                    name="campaignGoal"
                    value={formData.campaignGoal}
                    onChange={handleChange}
                    className="w-full appearance-none bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors cursor-pointer"
                  >
                    <option value="traffic">Traffic</option>
                    <option value="conversion">Conversion</option>
                    <option value="awareness">Awareness</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 mt-2 rounded-lg font-semibold text-white transition-all shadow-lg
                ${isLoading 
                  ? 'bg-blue-600/50 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.99]'
                }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating Creative...
                </span>
              ) : (
                'Generate Creative'
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Preview Panel */}
        <div className="flex flex-col bg-slate-900/50 rounded-xl border border-slate-800 shadow-xl overflow-hidden h-full min-h-[500px]">
          <div className="bg-slate-800/50 px-6 py-4 border-b border-slate-700">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
              Preview
            </h2>
          </div>

          <div className="flex-1 flex flex-col p-6 overflow-y-auto">
            {isLoading && (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 space-y-4 animate-pulse">
                <div className="h-48 w-full bg-slate-800 rounded-lg"></div>
                <div className="h-4 w-3/4 bg-slate-800 rounded"></div>
                <div className="h-4 w-1/2 bg-slate-800 rounded"></div>
                <p className="text-sm font-medium">AI is crafting your creative...</p>
              </div>
            )}

            {!isLoading && !creative && !error && (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                <p>Enter details and click generate to see the magic.</p>
              </div>
            )}

            {!isLoading && creative && (
              <div className="space-y-6 animate-in fade-in zoom-in duration-300">
                {/* Ad Preview Card Mockup */}
                <div className="bg-white text-slate-900 rounded-lg shadow-sm overflow-hidden border border-slate-200">
                  <div className="p-3 flex items-center gap-2 border-b border-slate-100">
                    <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
                      {formData.brandLogoUrl ? (
                        <img src={formData.brandLogoUrl} alt="Brand" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-blue-600 text-white font-bold text-xs">
                          {formData.brandName.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm leading-tight">{formData.brandName}</h3>
                      <p className="text-xs text-slate-500">Sponsored</p>
                    </div>
                  </div>
                  
                  <div className="p-3 pb-1">
                    <p className="text-sm text-slate-800 whitespace-pre-wrap">{creative.primary_text}</p>
                  </div>

                  <div className="relative bg-slate-100 min-h-[200px] flex items-center justify-center">
                    <img 
                      src={creative.generated_image_url} 
                      alt="Generated ad creative" 
                      className="w-full h-auto object-cover max-h-[400px]"
                    />
                  </div>

                  <div className="bg-slate-50 p-3 flex items-center justify-between border-t border-slate-100">
                    <div className="flex-1 pr-4">
                      <p className="text-xs text-slate-500 uppercase tracking-wide">
                        {new URL(formData.productImageUrl.startsWith('http') ? formData.productImageUrl : 'https://example.com').hostname}
                      </p>
                      <h4 className="font-bold text-sm md:text-base leading-tight mt-0.5 line-clamp-1">{creative.headline}</h4>
                    </div>
                    <button className="flex-shrink-0 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold py-1.5 px-4 rounded text-sm transition-colors border border-slate-300">
                      {creative.cta}
                    </button>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-800">
                  <h3 className="text-sm font-medium text-slate-400 mb-2">Assets</h3>
                  <div className="flex gap-2 text-xs">
                    <span className="px-2 py-1 bg-slate-800 rounded text-blue-300">Image Generated</span>
                    <span className="px-2 py-1 bg-slate-800 rounded text-green-300">Copy Written</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}