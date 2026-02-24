/**
 * Invoice Generator - Thermal Receipt Style
 * Editable content with live preview and print/PDF output
 */

(function () {
  'use strict';

  const DOM = {
    companyName: document.getElementById('companyName'),
    companyAddress: document.getElementById('companyAddress'),
    companyPhone: document.getElementById('companyPhone'),
    invoiceNumber: document.getElementById('invoiceNumber'),
    invoiceDate: document.getElementById('invoiceDate'),
    customerName: document.getElementById('customerName'),
    customerAddress: document.getElementById('customerAddress'),
    lineItems: document.getElementById('lineItems'),
    footerNote: document.getElementById('footerNote'),
    receipt: document.getElementById('receipt'),
    printReceipt: document.getElementById('printReceipt'),
    addItemBtn: document.getElementById('addItem'),
    printBtn: document.getElementById('printBtn'),
    pdfBtn: document.getElementById('pdfBtn'),
  };

  let itemIndex = 2;

  function getLineItemData() {
    const rows = DOM.lineItems.querySelectorAll('.line-item');
    return Array.from(rows).map((row) => ({
      desc: row.querySelector('.item-desc').value.trim(),
      qty: parseFloat(row.querySelector('.item-qty').value) || 0,
      price: parseFloat(row.querySelector('.item-price').value) || 0,
    }));
  }

  function calculateSubtotal(items) {
    return items.reduce((sum, item) => sum + item.qty * item.price, 0);
  }

  function formatCurrency(n) {
    return '$' + Number(n).toFixed(2);
  }

  function buildReceiptHTML(target) {
    const items = getLineItemData();
    const subtotal = calculateSubtotal(items);

    const companyName = DOM.companyName.value.trim() || 'Company Name';
    const companyAddress = DOM.companyAddress.value.trim();
    const companyPhone = DOM.companyPhone.value.trim();
    const invoiceNumber = DOM.invoiceNumber.value.trim() || 'INV-001';
    const invoiceDate = DOM.invoiceDate.value.trim() || new Date().toLocaleDateString();
    const customerName = DOM.customerName.value.trim() || 'Customer';
    const customerAddress = DOM.customerAddress.value.trim();
    const footerNote = DOM.footerNote.value.trim() || 'Thank you!';

    let itemsRows = items
      .filter((i) => i.desc || i.qty || i.price)
      .map(
        (i) =>
          `<tr>
        <td>${escapeHtml(i.desc) || '-'}</td>
        <td class="align-right">${i.qty}</td>
        <td class="align-right">${formatCurrency(i.price)}</td>
        <td class="align-right">${formatCurrency(i.qty * i.price)}</td>
      </tr>`
      )
      .join('');

    const html = `
      <div class="header">
        <div class="company-name">${escapeHtml(companyName)}</div>
        ${companyAddress ? `<div class="company-details">${escapeHtml(companyAddress)}</div>` : ''}
        ${companyPhone ? `<div class="company-details">${escapeHtml(companyPhone)}</div>` : ''}
      </div>
      <hr>
      <div class="section">
        <div class="section-title">Invoice</div>
        <div># ${escapeHtml(invoiceNumber)} &nbsp; | &nbsp; ${escapeHtml(invoiceDate)}</div>
      </div>
      <hr>
      <div class="section">
        <div class="section-title">Bill To</div>
        <div>${escapeHtml(customerName)}</div>
        ${customerAddress ? `<div>${escapeHtml(customerAddress)}</div>` : ''}
      </div>
      <hr>
      <table class="items-table">
        <thead>
          <tr>
            <th>Description</th>
            <th class="align-right">Qty</th>
            <th class="align-right">Price</th>
            <th class="align-right">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsRows || '<tr><td colspan="4" class="align-right">(no items)</td></tr>'}
        </tbody>
      </table>
      <hr>
      <div class="total-row" style="text-align: right;">
        TOTAL: ${formatCurrency(subtotal)}
      </div>
      <div class="footer">
        ${escapeHtml(footerNote).replace(/\n/g, '<br>')}
      </div>
    `;

    target.innerHTML = html;
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function updateReceipt() {
    buildReceiptHTML(DOM.receipt);
  }

  function addLineItem() {
    const div = document.createElement('div');
    div.className = 'line-item';
    div.dataset.index = itemIndex++;
    div.innerHTML = `
      <input type="text" class="item-desc" placeholder="Description" value="">
      <input type="number" class="item-qty" placeholder="Qty" value="1" min="0" step="1">
      <input type="number" class="item-price" placeholder="Price" value="0.00" min="0" step="0.01">
      <button type="button" class="btn-remove" title="Remove item">×</button>
    `;
    DOM.lineItems.appendChild(div);
    attachLineItemListeners(div);
    div.querySelector('.btn-remove').addEventListener('click', () => {
      div.remove();
      updateReceipt();
    });
    updateReceipt();
  }

  function initRemoveButtons() {
    DOM.lineItems.querySelectorAll('.btn-remove').forEach((btn) => {
      btn.addEventListener('click', () => {
        btn.closest('.line-item').remove();
        updateReceipt();
      });
    });
  }

  function attachLineItemListeners(container) {
    const inputs = container.querySelectorAll('input');
    inputs.forEach((input) => {
      input.addEventListener('input', updateReceipt);
      input.addEventListener('change', updateReceipt);
    });
  }

  function attachListeners() {
    const editableFields = [
      DOM.companyName,
      DOM.companyAddress,
      DOM.companyPhone,
      DOM.invoiceNumber,
      DOM.invoiceDate,
      DOM.customerName,
      DOM.customerAddress,
      DOM.footerNote,
    ];

    editableFields.forEach((el) => {
      if (el) {
        el.addEventListener('input', updateReceipt);
        el.addEventListener('change', updateReceipt);
      }
    });

    DOM.lineItems.querySelectorAll('.line-item').forEach(attachLineItemListeners);
    initRemoveButtons();

    DOM.addItemBtn.addEventListener('click', addLineItem);

    DOM.printBtn.addEventListener('click', () => {
      buildReceiptHTML(DOM.printReceipt);
      window.print();
    });

    DOM.pdfBtn.addEventListener('click', () => {
      buildReceiptHTML(DOM.printReceipt);
      window.print();
      // Browser's print dialog offers "Save as PDF" - user can choose it
      // For programmatic PDF, would need html2pdf.js or similar
    });
  }

  function init() {
    attachListeners();
    updateReceipt();
  }

  init();
})();
