import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';

interface TenantBillingInvoicesViewProps {
  onNavigateToOverview: () => void;
  onNavigateToUpgrade: () => void;
}

export const TenantBillingInvoicesView: React.FC<TenantBillingInvoicesViewProps> = ({
  onNavigateToOverview,
  onNavigateToUpgrade,
}) => {
  const { currentCompany } = usePlatform();
  const tenant = {
    id: currentCompany.id,
    tierName: '20 Dev Starter',
    monthlyCost: 199,
    nextBillingDate: 'Apr 1, 2025',
    adminName: 'Jane Austen',
    adminEmail: 'j.austen@techcorp.com',
    name: currentCompany.name,
  };

  const invoices = [
    {
      id: 'in_1P9A8D2eZvKYlo2C8Jq3A2G1',
      billingDate: 'Mar 1, 2025',
      tierPlan: '20 Dev Starter',
      seatsBilled: 20,
      amount: '$199.00',
      status: 'Paid',
    },
    {
      id: 'in_1P5T2X2eZvKYlo2C4Kx9P7M2',
      billingDate: 'Feb 1, 2025',
      tierPlan: '20 Dev Starter',
      seatsBilled: 20,
      amount: '$199.00',
      status: 'Paid',
    },
    {
      id: 'in_1P1B5Q2eZvKYlo2C9Nj4V5L8',
      billingDate: 'Jan 1, 2025',
      tierPlan: '20 Dev Starter',
      seatsBilled: 20,
      amount: '$199.00',
      status: 'Paid',
    }
  ];
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  const [showEditLegalEntity, setShowEditLegalEntity] = useState(false);
  const [taxId, setTaxId] = useState('US-EIN 94-8291041');
  const [companyAddress, setCompanyAddress] = useState(
    '100 Innovation Way, Suite 400\nSan Francisco, CA 94105, United States'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-5 sm:space-y-6">
      {/* Breadcrumbs & Header */}
      <div className="flex flex-col gap-4 border-b border-[#c7c4d8]/40 pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight text-[#0b1c30]">
                License Usage &amp; Billing
              </h1>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#eff4ff] text-[#565e74] border border-[#c7c4d8]">
                {tenant.id}
              </span>
            </div>
            <p className="text-[14px] text-[#565e74] mt-0.5">
              Review team subscriptions, automated billing cycles, tax records, and downloadable receipts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert('Exporting all invoices to CSV...')}
              className="h-8 px-3 rounded-lg border border-[#c7c4d8] bg-white hover:bg-[#eff4ff] text-[#0b1c30] text-[12px] font-medium flex items-center gap-1.5 shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">file_download</span>
              <span>Export CSV</span>
            </button>
            <button
              onClick={onNavigateToUpgrade}
              className="h-8 px-3 rounded-lg bg-[#4f46e5] hover:bg-[#3525cd] text-white text-[12px] font-medium flex items-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">upgrade</span>
              <span>Upgrade Tier</span>
            </button>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center gap-8 -mb-px text-[13px]">
          <button
            onClick={onNavigateToOverview}
            className="pb-2.5 text-[#565e74] hover:text-[#0b1c30] transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">monitoring</span>
            <span>Overview &amp; Quotas</span>
          </button>
          <button
            onClick={onNavigateToUpgrade}
            className="pb-2.5 text-[#565e74] hover:text-[#0b1c30] transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">north_east</span>
            <span>Upgrade Tier</span>
          </button>
          <button className="pb-2.5 text-[#3525cd] font-semibold border-b-2 border-[#3525cd] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">receipt_long</span>
            <span>Billing &amp; Invoices</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-[#3525cd] text-white font-mono">
              Active
            </span>
          </button>
        </div>
      </div>

      {/* Top 3 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Current Billing Plan */}
        <div className="bg-white border border-[#c7c4d8] rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-mono uppercase text-[#565e74] tracking-wider">
                Current Billing Plan
              </span>
              <h3 className="text-xl font-bold text-[#0b1c30] mt-1">{tenant.tierName}</h3>
            </div>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#059669]"></span>
              Auto-Renew Active
            </span>
          </div>

          <div className="mt-4 pt-3 border-t border-[#eff4ff] flex items-baseline justify-between">
            <div>
              <span className="text-2xl font-bold text-[#0b1c30] font-mono">${tenant.monthlyCost}.00</span>
              <span className="text-[13px] text-[#565e74]"> / month</span>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-[#565e74]">Next cycle</p>
              <p className="text-[12px] font-mono text-[#0b1c30] font-semibold">{tenant.nextBillingDate}</p>
            </div>
          </div>
        </div>

        {/* Card 2: Payment Method */}
        <div className="bg-white border border-[#c7c4d8] rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-mono uppercase text-[#565e74] tracking-wider">
                Payment Method
              </span>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-9 h-6 rounded bg-[#1e293b] text-white flex items-center justify-center font-bold text-[10px] tracking-widest border border-slate-700">
                  VISA
                </div>
                <span className="text-[15px] font-mono font-semibold text-[#0b1c30]">•••• 4242</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#eff4ff] text-[#565e74] border border-[#c7c4d8]">
              Default
            </span>
          </div>

          <div className="mt-4 pt-3 border-t border-[#eff4ff] flex items-center justify-between">
            <span className="text-[12px] text-[#565e74]">
              Expires <strong className="text-[#0b1c30] font-mono font-medium">08/28</strong>
            </span>
            <button
              onClick={() => alert('Update credit card payment dialog')}
              className="text-[12px] font-mono text-[#3525cd] font-medium hover:underline flex items-center gap-0.5"
            >
              <span>Update Card</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Card 3: Billing Contact */}
        <div className="bg-white border border-[#c7c4d8] rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-mono uppercase text-[#565e74] tracking-wider">
                Billing Contact
              </span>
              <h3 className="text-[16px] font-semibold text-[#0b1c30] mt-1">{tenant.adminName}</h3>
              <p className="text-[12px] text-[#565e74] font-mono mt-0.5">{tenant.adminEmail}</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-[#eff4ff] flex items-center justify-center text-[#565e74]">
              <span className="material-symbols-outlined text-[18px]">mail</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#eff4ff] flex items-center justify-between">
            <span className="text-[11px] text-[#565e74]">Receives monthly invoice PDFs</span>
            <button
              onClick={() => alert('Edit billing contact email popup')}
              className="text-[12px] font-mono text-[#3525cd] font-medium hover:underline flex items-center gap-0.5"
            >
              <span>Edit Contact</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Table Card: Invoice & Payment History */}
      <div className="bg-white border border-[#c7c4d8] rounded-xl shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-[#c7c4d8] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#3525cd] text-[20px]">history</span>
            <h2 className="text-[16px] font-semibold text-[#0b1c30]">Invoice &amp; Payment History</h2>
            <span className="text-[11px] font-mono bg-[#eff4ff] text-[#565e74] px-2 py-0.5 rounded-full">
              {invoices.length} records
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-[12px] text-[#565e74] border border-[#c7c4d8] rounded px-2.5 py-1 bg-[#eff4ff]">
              <span>Filter:</span>
              <span className="font-medium text-[#0b1c30]">All Time</span>
              <span className="material-symbols-outlined text-[14px]">arrow_drop_down</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] md:min-w-0 text-left border-collapse">
            <thead>
              <tr className="bg-[#eff4ff] border-b border-[#c7c4d8] text-[11px] font-mono uppercase text-[#565e74] tracking-wider h-8">
                <th className="py-2.5 px-4 font-semibold">Invoice ID</th>
                <th className="py-2.5 px-4 font-semibold">Billing Date</th>
                <th className="py-2.5 px-4 font-semibold">Tier Plan</th>
                <th className="py-2.5 px-4 font-semibold">Seats Billed</th>
                <th className="py-2.5 px-4 font-semibold text-right">Amount</th>
                <th className="py-2.5 px-4 font-semibold text-center">Status</th>
                <th className="py-2.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c7c4d8]/40 text-[13px]">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-[#eff4ff]/40 transition-colors">
                  <td className="py-3 px-4 font-mono text-[12px] font-medium text-[#0b1c30] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#565e74]">description</span>
                    <span>{inv.id}</span>
                  </td>
                  <td className="py-3 px-4 text-[#565e74] font-mono text-[12px]">{inv.billingDate}</td>
                  <td className="py-3 px-4 font-medium text-[#0b1c30]">{inv.tierPlan}</td>
                  <td className="py-3 px-4 font-mono text-[12px] text-[#565e74]">{inv.seatsBilled}</td>
                  <td className="py-3 px-4 font-mono font-semibold text-[#0b1c30] text-right">
                    {inv.amount}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#065f46]"></span>
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => {
                          alert(`Downloading PDF for invoice ${inv.id}...`);
                        }}
                        className="h-7 px-2.5 rounded border border-[#c7c4d8] hover:border-[#3525cd] hover:text-[#3525cd] bg-white text-[11px] font-mono flex items-center gap-1 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[14px]">download</span>
                        <span>PDF</span>
                      </button>
                      <button
                        onClick={() => setSelectedInvoice(inv)}
                        className="text-[11px] font-mono text-[#565e74] hover:text-[#0b1c30] underline"
                      >
                        Receipt
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3 bg-[#eff4ff]/60 border-t border-[#c7c4d8] flex flex-col sm:flex-row items-center justify-between text-[12px] text-[#565e74] gap-2">
          <span>Invoices are generated automatically on the 1st of every calendar month.</span>
          <span className="font-mono text-[11px]">Showing {invoices.length} of {invoices.length}</span>
        </div>
      </div>

      {/* Tax & Address Summary Box */}
      <div className="bg-white border border-[#c7c4d8] rounded-xl p-5 shadow-xs">
        <div className="flex items-start justify-between pb-3 border-b border-[#eff4ff]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#565e74] text-[20px]">apartment</span>
            <div>
              <h3 className="text-[15px] font-semibold text-[#0b1c30]">Legal Entity &amp; Tax Information</h3>
              <p className="text-[12px] text-[#565e74]">
                These details appear on your past and future generated PDF invoices.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowEditLegalEntity(true)}
            className="text-[12px] font-mono text-[#3525cd] font-medium hover:underline flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[15px]">edit</span>
            <span>Update Legal Entity</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-mono uppercase text-[#565e74]">
              VAT / Federal Tax ID (EIN)
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-mono text-[13px] text-[#0b1c30] font-semibold bg-[#eff4ff] px-2 py-1 rounded border border-[#c7c4d8]">
                {taxId}
              </span>
              <span className="material-symbols-outlined text-[#006e4b] text-[18px]" title="Tax Status Verified">
                verified
              </span>
            </div>
            <span className="text-[11px] text-[#565e74] mt-1">Verified with IRS business records database.</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-mono uppercase text-[#565e74]">
              Registered Company Address
            </span>
            <div className="text-[13px] text-[#0b1c30]">
              <p className="font-semibold">{tenant.name}</p>
              <p className="text-[#565e74] whitespace-pre-line">{companyAddress}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Receipt Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#213145]/60 p-4">
          <div className="bg-white rounded-xl border border-[#c7c4d8] max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#c7c4d8]/60">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006e4b]">verified</span>
                <h3 className="text-[16px] font-semibold text-[#0b1c30]">Payment Receipt</h3>
              </div>
              <button onClick={() => setSelectedInvoice(null)} className="text-[#565e74]">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="space-y-3 py-4 text-[13px]">
              <div className="flex justify-between">
                <span className="text-[#565e74]">Receipt Number:</span>
                <span className="font-mono font-semibold text-[#0b1c30]">{selectedInvoice.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#565e74]">Date Paid:</span>
                <span className="font-mono text-[#0b1c30]">{selectedInvoice.billingDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#565e74]">Tier Plan:</span>
                <span className="text-[#0b1c30] font-medium">{selectedInvoice.tierPlan}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#565e74]">Developer Capacity:</span>
                <span className="font-mono text-[#0b1c30]">{selectedInvoice.seatsBilled}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#eff4ff]">
                <span className="font-semibold text-[#0b1c30]">Total Charged:</span>
                <span className="font-mono font-bold text-lg text-[#3525cd]">{selectedInvoice.amount}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#c7c4d8] flex justify-end gap-2">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="h-8 px-4 rounded border border-[#c7c4d8] text-[12px] text-[#565e74]"
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert(`Downloading receipt PDF ${selectedInvoice.id}...`);
                  setSelectedInvoice(null);
                }}
                className="h-8 px-4 rounded bg-[#4f46e5] text-white text-[12px] font-medium"
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Legal Entity Modal */}
      {showEditLegalEntity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#213145]/60 p-4">
          <div className="bg-white rounded-xl border border-[#c7c4d8] max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#c7c4d8]/60">
              <h3 className="text-[16px] font-semibold text-[#0b1c30]">Update Legal Tax Entity</h3>
              <button onClick={() => setShowEditLegalEntity(false)} className="text-[#565e74]">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="space-y-3 py-4 text-[13px]">
              <div>
                <label className="text-[11px] font-mono text-[#565e74] uppercase block mb-1">
                  Tax ID / EIN
                </label>
                <input
                  type="text"
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                  className="w-full h-8 px-2.5 rounded border border-[#c7c4d8] font-mono text-[12px]"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-[#565e74] uppercase block mb-1">
                  Registered Address
                </label>
                <textarea
                  rows={3}
                  value={companyAddress}
                  onChange={(e) => setCompanyAddress(e.target.value)}
                  className="w-full p-2.5 rounded border border-[#c7c4d8] text-[13px]"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#c7c4d8] flex justify-end gap-2">
              <button
                onClick={() => setShowEditLegalEntity(false)}
                className="h-8 px-3 rounded border border-[#c7c4d8] text-[12px] text-[#565e74]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Legal entity tax information updated successfully.');
                  setShowEditLegalEntity(false);
                }}
                className="h-8 px-4 rounded bg-[#4f46e5] text-white text-[12px] font-medium"
              >
                Save Info
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
