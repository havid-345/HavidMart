import React, { useState, useEffect } from 'react';
import { POSProvider, usePOS } from './context/POSContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { POSMainView } from './components/POSMainView';
import { CartSidebar } from './components/CartSidebar';
import { CheckoutModal } from './components/CheckoutModal';
import { BarcodeScannerModal } from './components/BarcodeScannerModal';
import { AnalyticsView } from './components/AnalyticsView';
import { InventoryView } from './components/InventoryView';
import { DiscountManagerView } from './components/DiscountManagerView';
import { HistoryView } from './components/HistoryView';
import { ReceiptCustomizationView } from './components/ReceiptCustomizationView';
import { SecurityView } from './components/SecurityView';
import { CashAdjustmentModal } from './components/CashAdjustmentModal';
import { MemberSelectModal } from './components/MemberSelectModal';
import { AccessibilityModal } from './components/AccessibilityModal';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { formatRupiah } from './utils/calculations';

const POSDashboard: React.FC = () => {
  const {
    activeTab,
    fontSize,
    highContrast,
    isBarcodeModalOpen,
    setIsBarcodeModalOpen,
    isCheckoutModalOpen,
    setIsCheckoutModalOpen,
    cart,
    cartTotals,
    products,
    addToCart,
    isDarkMode,
  } = usePOS();

  // Mobile drawer states
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);

  // Modals state
  const [cashAdjustmentType, setCashAdjustmentType] = useState<'in' | 'out' | null>(null);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isAccessibilityModalOpen, setIsAccessibilityModalOpen] = useState(false);

  // Global Keyboard shortcuts & Hardware Barcode Gun listener
  useEffect(() => {
    let barcodeBuffer = '';
    let lastKeyTime = Date.now();

    const handleKeyDown = (e: KeyboardEvent) => {
      // Hotkeys: F2 (Search), F4 (Barcode Scan), F8 (Checkout), Esc (Close)
      if (e.key === 'F2') {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (searchInput) searchInput.focus();
      } else if (e.key === 'F4') {
        e.preventDefault();
        setIsBarcodeModalOpen(true);
      } else if (e.key === 'F8') {
        e.preventDefault();
        if (cart.length > 0) setIsCheckoutModalOpen(true);
      } else if (e.key === 'Escape') {
        setIsBarcodeModalOpen(false);
        setIsCheckoutModalOpen(false);
        setCashAdjustmentType(null);
        setIsMemberModalOpen(false);
        setIsAccessibilityModalOpen(false);
        setIsMobileMenuOpen(false);
        setIsMobileCartOpen(false);
      }

      // Barcode Scanner detection (rapid key inputs)
      const now = Date.now();
      if (now - lastKeyTime > 100) {
        barcodeBuffer = '';
      }
      lastKeyTime = now;

      if (e.key === 'Enter') {
        if (barcodeBuffer.length >= 6) {
          // Find matching product
          const matched = products.find((p) => p.barcode === barcodeBuffer);
          if (matched) {
            addToCart(matched, 1);
          }
          barcodeBuffer = '';
        }
      } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        barcodeBuffer += e.key;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [products, cart, addToCart, setIsBarcodeModalOpen, setIsCheckoutModalOpen]);

  // Compute root font size class
  const fontSizeClass =
    fontSize === 'extralarge'
      ? 'text-base'
      : fontSize === 'large'
      ? 'text-[15px]'
      : 'text-sm';

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div
      className={`${isDarkMode ? 'dark ' : ''}min-h-screen bg-[#ede9fe] dark:bg-slate-950 p-0 sm:p-3 lg:p-5 flex items-center justify-center font-sans antialiased selection:bg-purple-500 selection:text-white transition-colors duration-200 ${
        highContrast ? 'contrast-125' : ''
      }`}
    >
      {/* Outer Card matching the floating rounded window in the user's reference screenshot */}
      <div
        className={`w-full max-w-[1560px] h-screen sm:h-[94vh] bg-white dark:bg-slate-900 rounded-none sm:rounded-[32px] shadow-2xl overflow-hidden flex flex-col border-0 sm:border border-purple-200/60 dark:border-slate-800 ${fontSizeClass}`}
      >
        <div className="flex-1 flex overflow-hidden relative">
          {/* 1. Left Sidebar for Desktop (>= lg) */}
          <div className="hidden lg:flex shrink-0">
            <Sidebar />
          </div>

          {/* 1b. Mobile Sidebar Drawer (< lg) */}
          {isMobileMenuOpen && (
            <div className="lg:hidden fixed inset-0 z-50 flex">
              <div
                className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <div className="relative z-10 w-72 h-full bg-[#14112e] shadow-2xl">
                <Sidebar onCloseMobile={() => setIsMobileMenuOpen(false)} />
              </div>
            </div>
          )}

          {/* 2. Middle Main Section */}
          <div className="flex-1 flex flex-col min-w-0 bg-slate-50/60 dark:bg-slate-900/60 relative">
            {/* Header with hamburger */}
            <Header
              onOpenAccessibility={() => setIsAccessibilityModalOpen(true)}
              onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
            />

            {/* Active Tab View */}
            <main className="flex-1 overflow-hidden flex flex-col relative">
              {activeTab === 'pos' && <POSMainView />}
              {activeTab === 'inventory' && <InventoryView />}
              {activeTab === 'history' && <HistoryView />}
              {activeTab === 'analytics' && <AnalyticsView />}
              {activeTab === 'discounts' && <DiscountManagerView />}
              {activeTab === 'receipt_customization' && <ReceiptCustomizationView />}
              {activeTab === 'security' && <SecurityView />}

              {/* Floating Mobile Cart Trigger (visible on POS tab on < xl screens when cart has items) */}
              {activeTab === 'pos' && (
                <div className="xl:hidden p-3 bg-white/95 dark:bg-slate-900/95 border-t border-slate-200 dark:border-slate-800 backdrop-blur-md shadow-lg shrink-0 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-[#582be8] text-white flex items-center justify-center font-bold shadow-md">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {totalCartCount} item dalam keranjang
                      </div>
                      <div className="text-sm font-black text-purple-700 dark:text-purple-300">
                        {formatRupiah(cartTotals.finalTotal)}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsMobileCartOpen(true)}
                    className="px-4 py-2.5 bg-[#582be8] hover:bg-[#4820c7] text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                  >
                    <span>Buka Kasir / Bayar</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </main>
          </div>

          {/* 3. Right Cart Sidebar (Desktop >= xl) */}
          {activeTab === 'pos' && (
            <div className="hidden xl:flex shrink-0">
              <CartSidebar />
            </div>
          )}

          {/* 3b. Mobile Cart Sidebar Drawer (< xl) */}
          {activeTab === 'pos' && isMobileCartOpen && (
            <div className="xl:hidden fixed inset-0 z-50 flex justify-end">
              <div
                className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
                onClick={() => setIsMobileCartOpen(false)}
              />
              <div className="relative z-10 w-full sm:w-96 max-w-full h-full bg-white dark:bg-slate-900 shadow-2xl flex flex-col">
                <CartSidebar onCloseMobile={() => setIsMobileCartOpen(false)} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <CheckoutModal />
      <BarcodeScannerModal />

      {cashAdjustmentType && (
        <CashAdjustmentModal
          type={cashAdjustmentType}
          onClose={() => setCashAdjustmentType(null)}
        />
      )}

      {isMemberModalOpen && (
        <MemberSelectModal onClose={() => setIsMemberModalOpen(false)} />
      )}

      {isAccessibilityModalOpen && (
        <AccessibilityModal onClose={() => setIsAccessibilityModalOpen(false)} />
      )}
    </div>
  );
};

export default function App() {
  return (
    <POSProvider>
      <POSDashboard />
    </POSProvider>
  );
}
