import React, { useState } from 'react';
import {
  Printer,
  Store,
  Phone,
  MapPin,
  FileText,
  Check,
  RotateCcw,
  Sparkles,
  Sliders,
  Eye,
  QrCode,
  Tag,
  CheckCircle2,
} from 'lucide-react';
import { usePOS } from '../context/POSContext';
import { ReceiptConfig } from '../types/pos';
import { INITIAL_RECEIPT_CONFIG } from '../data/initialData';
import { formatRupiah } from '../utils/calculations';

export const ReceiptCustomizationView: React.FC = () => {
  const { receiptConfig, updateReceiptConfig } = usePOS();

  // Local draft state for smooth editing with safe fallback to INITIAL_RECEIPT_CONFIG
  const [form, setForm] = useState<ReceiptConfig>(() => ({
    ...INITIAL_RECEIPT_CONFIG,
    ...(receiptConfig || {}),
  }));
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Keep form in sync when context loads or updates
  React.useEffect(() => {
    if (receiptConfig) {
      setForm({
        ...INITIAL_RECEIPT_CONFIG,
        ...receiptConfig,
      });
    }
  }, [receiptConfig]);

  const handleChange = <K extends keyof ReceiptConfig>(key: K, value: ReceiptConfig[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSavedSuccess(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateReceiptConfig(form);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleReset = () => {
    setForm({ ...INITIAL_RECEIPT_CONFIG });
    updateReceiptConfig(INITIAL_RECEIPT_CONFIG);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handlePrintTest = () => {
    window.print();
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Printer className="w-6 h-6 text-purple-600" />
            Pengaturan & Kustomisasi Struk Kasir
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Atur identitas warung, informasi header/footer, ukuran kertas thermal, dan pratinjau langsung struk belanja.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handlePrintTest}
            className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Uji Coba</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 text-slate-600 hover:text-rose-600 dark:text-slate-300 dark:hover:text-rose-400 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Standar</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>Pengaturan struk berhasil disimpan dan akan langsung diterapkan pada semua cetakan transaksi kasir!</span>
        </div>
      )}

      {/* Main Grid: Form Left, Preview Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: 7 cols on lg */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Sliders className="w-5 h-5 text-purple-600" />
            <h3 className="font-bold text-base text-slate-800 dark:text-white">
              Formulir Identitas & Konten Struk
            </h3>
          </div>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            {/* Store Name & Tagline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Nama Toko / Warung
                </label>
                <div className="relative">
                  <Store className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={form.storeName || ''}
                    onChange={(e) => handleChange('storeName', e.target.value)}
                    placeholder="Contoh: HAVID MART"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Slogan / Tagline
                </label>
                <div className="relative">
                  <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={form.storeTagline || ''}
                    onChange={(e) => handleChange('storeTagline', e.target.value)}
                    placeholder="Contoh: Toko Kelontong & Sembako Murah"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Address & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Alamat Toko
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={form.storeAddress || ''}
                    onChange={(e) => handleChange('storeAddress', e.target.value)}
                    placeholder="Contoh: Jl. Guna Tani, Dusun Biru, Cijati, Cimanggu"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  No. Telepon / WhatsApp
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={form.storePhone || ''}
                    onChange={(e) => handleChange('storePhone', e.target.value)}
                    placeholder="Contoh: 0838-3869-5666"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Header Greeting & Footer Note */}
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Pesan Pembuka (Header Note)
              </label>
              <input
                type="text"
                value={form.headerNote || ''}
                onChange={(e) => handleChange('headerNote', e.target.value)}
                placeholder="Contoh: Terima kasih atas kunjungan Anda"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Catatan Penutup / Syarat Toko (Footer Note)
              </label>
              <textarea
                rows={2}
                value={form.footerNote || ''}
                onChange={(e) => handleChange('footerNote', e.target.value)}
                placeholder="Contoh: Barang yang sudah dibeli dapat ditukar 1x24 jam jika cacat produksi."
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Paper Width & Display Options */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl space-y-3 border border-slate-200/80 dark:border-slate-700/80">
              <span className="font-bold text-slate-800 dark:text-white block">
                Opsi Cetak Thermal & Tampilan
              </span>

              {/* Paper width selector */}
              <div>
                <label className="text-slate-600 dark:text-slate-400 block mb-1.5 font-medium">
                  Ukuran Lebar Kertas Printer:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleChange('paperWidth', '58mm')}
                    className={`py-2 px-3 rounded-xl border font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      (form.paperWidth || '58mm') === '58mm'
                        ? 'bg-[#582be8] text-white border-purple-600 shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <span>58mm (Standar Mini)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange('paperWidth', '80mm')}
                    className={`py-2 px-3 rounded-xl border font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      (form.paperWidth || '58mm') === '80mm'
                        ? 'bg-[#582be8] text-white border-purple-600 shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <span>80mm (Thermal POS Lebar)</span>
                  </button>
                </div>
              </div>

              {/* Checkbox toggles */}
              <div className="space-y-2 pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.showLogoOrIcon ?? true}
                    onChange={(e) => handleChange('showLogoOrIcon', e.target.checked)}
                    className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-slate-700 dark:text-slate-300 font-medium">
                    Tampilkan Ikon Warung / Logo Toko di Header Struk
                  </span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.showCashierName ?? true}
                    onChange={(e) => handleChange('showCashierName', e.target.checked)}
                    className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-slate-700 dark:text-slate-300 font-medium">
                    Tampilkan Nama Kasir / Operator Shift
                  </span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.showBarcode ?? true}
                    onChange={(e) => handleChange('showBarcode', e.target.checked)}
                    className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-slate-700 dark:text-slate-300 font-medium">
                    Tampilkan Kode Barcode Transaksi di Bawah Struk
                  </span>
                </label>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-[#582be8] hover:bg-[#4820c7] text-white font-black text-sm rounded-xl shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99]"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Simpan Pengaturan Struk</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Preview: 5 cols on lg */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-sm">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                Live Thermal Preview ({form.paperWidth || '58mm'})
              </span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-yellow-400 text-slate-950 font-bold rounded">
                Thermal Paper
              </span>
            </div>

            {/* Paper mockup container */}
            <div
              className={`bg-white text-slate-900 rounded-xl p-5 shadow-2xl border border-slate-300 font-mono text-[11px] leading-relaxed select-none transition-all mx-auto ${
                (form.paperWidth || '58mm') === '80mm' ? 'w-full max-w-[340px]' : 'w-full max-w-[280px]'
              }`}
              style={{
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
              }}
            >
              {/* Receipt Header */}
              <div className="text-center space-y-1 pb-2 border-b border-dashed border-slate-400">
                {(form.showLogoOrIcon ?? true) && (
                  <div className="w-7 h-7 mx-auto rounded-lg bg-yellow-400 text-slate-950 flex items-center justify-center mb-1 shadow-xs">
                    <Store className="w-4 h-4" />
                  </div>
                )}
                <h4 className="font-black text-xs uppercase tracking-wider">{form.storeName || 'HAVID MART'}</h4>
                {form.storeTagline && (
                  <p className="text-[10px] text-slate-600">{form.storeTagline}</p>
                )}
                <p className="text-[10px] text-slate-500">{form.storeAddress || 'Jl. Guna Tani, Dusun Biru, Cijati, Cimanggu'}</p>
                {(form.storePhone || '0838-3869-5666') && (
                  <p className="text-[10px] text-slate-500">Telp/WA: {form.storePhone || '0838-3869-5666'}</p>
                )}
              </div>

              {/* Meta info */}
              <div className="py-2 border-b border-dashed border-slate-400 text-[10px] space-y-0.5">
                <div className="flex justify-between">
                  <span>No. Trx:</span>
                  <span className="font-bold">TRX-20261028-0099</span>
                </div>
                <div className="flex justify-between">
                  <span>Waktu:</span>
                  <span>{new Date().toLocaleDateString('id-ID')} 14:30 WIB</span>
                </div>
                {form.showCashierName && (
                  <div className="flex justify-between">
                    <span>Kasir:</span>
                    <span>Samantha (Kasir)</span>
                  </div>
                )}
              </div>

              {form.headerNote && (
                <div className="text-center py-1.5 text-[10px] text-slate-600 italic border-b border-dashed border-slate-300">
                  &ldquo;{form.headerNote}&rdquo;
                </div>
              )}

              {/* Sample Items List */}
              <div className="py-2 border-b border-dashed border-slate-400 space-y-1.5">
                <div>
                  <div className="font-bold">Beras Pandan Wangi 5kg</div>
                  <div className="flex justify-between text-slate-600 text-[10px]">
                    <span>1 x Rp 74.000</span>
                    <span>Rp 74.000</span>
                  </div>
                </div>
                <div>
                  <div className="font-bold">Minyak Goreng Bimoli 2L</div>
                  <div className="flex justify-between text-slate-600 text-[10px]">
                    <span>2 x Rp 36.500</span>
                    <span>Rp 73.000</span>
                  </div>
                </div>
                <div>
                  <div className="font-bold">Indomie Goreng Spesial</div>
                  <div className="flex justify-between text-slate-600 text-[10px]">
                    <span>5 x Rp 3.500</span>
                    <span>Rp 17.500</span>
                  </div>
                </div>
              </div>

              {/* Totals */}
              <div className="py-2 border-b border-dashed border-slate-400 text-[10px] space-y-1">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>Rp 164.500</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Diskon Promo (JUMATBERKAH):</span>
                  <span>-Rp 11.515</span>
                </div>
                <div className="flex justify-between font-black text-xs pt-1 border-t border-slate-200">
                  <span>TOTAL AKHIR:</span>
                  <span>Rp 152.985</span>
                </div>
                <div className="flex justify-between pt-0.5">
                  <span>Tunai (Cash):</span>
                  <span>Rp 160.000</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900">
                  <span>Kembalian:</span>
                  <span>Rp 7.015</span>
                </div>
              </div>

              {/* Footer Policy */}
              {form.footerNote && (
                <div className="py-2 text-center text-[9px] text-slate-500 leading-tight">
                  {form.footerNote}
                </div>
              )}

              {/* Barcode Mockup */}
              {form.showBarcode && (
                <div className="pt-2 text-center">
                  <div className="inline-block py-1 px-3 bg-slate-100 rounded">
                    <div className="flex justify-center items-center gap-0.5 h-6">
                      {[1, 2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 3, 1, 2].map((w, idx) => (
                        <div
                          key={idx}
                          className="bg-slate-950 h-full"
                          style={{ width: `${w * 1.5}px` }}
                        />
                      ))}
                    </div>
                    <span className="text-[9px] font-mono tracking-widest text-slate-600 block mt-0.5">
                      899123456001
                    </span>
                  </div>
                </div>
              )}

              {/* Jagged bottom decoration */}
              <div className="text-center mt-2 text-[10px] text-slate-400">
                - - - - - - - - - - - - - - - - - - -
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
