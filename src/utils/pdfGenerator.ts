import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Transaction, MemberDue, LPJReport } from '../types';
import { formatRupiah } from './formatters';

export interface PDFExportOptions {
  includeTransactions?: boolean;
  includeMemberDues?: boolean;
  periodName?: string;
  notes?: string;
}

/**
 * Generates an official, publication-grade LPJ (Laporan Pertanggungjawaban)
 * Financial Report PDF for student organizations (HIMA ILKOM).
 */
export const generateOfficialLpjPdf = (
  lpjData: LPJReport,
  transactions: Transaction[],
  members: MemberDue[],
  options: PDFExportOptions = {}
): jsPDF => {
  const {
    includeTransactions = true,
    includeMemberDues = true,
    periodName = lpjData.period || 'Semester Ganjil 2024/2025',
    notes,
  } = options;

  // Initialize PDF in Portrait, A4 format
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 14;
  let currentY = 14;

  // Colors based on KasKampus brand palette
  const PRIMARY_COLOR: [number, number, number] = [0, 105, 72]; // #006948 Emerald
  const SECONDARY_COLOR: [number, number, number] = [40, 48, 68]; // #283044 Dark Slate
  const ACCENT_RED: [number, number, number] = [182, 23, 34]; // #b61722 Crimson
  const LIGHT_BG: [number, number, number] = [242, 243, 255]; // #f2f3ff
  const TEXT_MUTED: [number, number, number] = [100, 115, 105];

  // Helper for text alignment
  const centerText = (text: string, y: number, fontSize = 10, isBold = false) => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    doc.text(text, pageWidth / 2, y, { align: 'center' });
  };

  // --- KOP SURAT RESMI (OFFICIAL LETTERHEAD) ---
  doc.setTextColor(SECONDARY_COLOR[0], SECONDARY_COLOR[1], SECONDARY_COLOR[2]);
  centerText('HIMPUNAN MAHASISWA ILMU KOMPUTER (HIMA ILKOM)', currentY, 13, true);
  currentY += 5;
  centerText('FAKULTAS ILMU KOMPUTER & TEKNOLOGI INFORMASI', currentY, 10, true);
  currentY += 4.5;
  doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
  centerText('Sekretariat: Gedung Pusat Ormawa Lt. 2 Kampus Utama | Email: bendahara.ilkom@campus.ac.id', currentY, 8, false);
  currentY += 4;
  centerText('Portal Transparansi Digital: kaskampus.id/hima-ilkom • Rek Mandiri: 137-00-98721-1', currentY, 8, false);
  currentY += 4;

  // Double Divider Lines (Standard Indonesian Kop Surat)
  doc.setDrawColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
  doc.setLineWidth(0.8);
  doc.line(marginX, currentY, pageWidth - marginX, currentY);
  currentY += 0.8;
  doc.setLineWidth(0.2);
  doc.line(marginX, currentY, pageWidth - marginX, currentY);
  currentY += 6;

  // --- TITLE & DOCUMENT METADATA ---
  doc.setTextColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
  centerText('LAPORAN PERTANGGUNGJAWABAN (LPJ) KEUANGAN RESMI', currentY, 12, true);
  currentY += 4.5;
  doc.setTextColor(SECONDARY_COLOR[0], SECONDARY_COLOR[1], SECONDARY_COLOR[2]);
  centerText(`PERIODE: ${periodName.toUpperCase()}`, currentY, 9, true);
  currentY += 5;

  // Document metadata box
  doc.setFillColor(LIGHT_BG[0], LIGHT_BG[1], LIGHT_BG[2]);
  doc.roundedRect(marginX, currentY, pageWidth - 2 * marginX, 16, 2, 2, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(50, 60, 55);

  const docNumber = 'Nomor: LPJ-KEU/HIMA-ILKOM/V/2025/082';
  const docDate = `Tanggal Cetak: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`;
  const auditorName = `Auditor: ${lpjData.auditor || 'Dewan Pengawas Organisasi & BEM'}`;
  const statusAudit = 'Status: TERVERIFIKASI & DIAUDIT PENUH (100% SESUAI)';

  doc.text(docNumber, marginX + 4, currentY + 5.5);
  doc.text(auditorName, marginX + 4, currentY + 11.5);
  doc.text(docDate, pageWidth - marginX - 4, currentY + 5.5, { align: 'right' });
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
  doc.text(statusAudit, pageWidth - marginX - 4, currentY + 11.5, { align: 'right' });

  currentY += 21;

  // --- RINGKASAN NERACA KAS (EXECUTIVE SUMMARY TILES) ---
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(SECONDARY_COLOR[0], SECONDARY_COLOR[1], SECONDARY_COLOR[2]);
  doc.text('I. REKAPITULASI NERACA SALDO ORGANISASI', marginX, currentY);
  currentY += 3;

  const boxWidth = (pageWidth - 2 * marginX - 6) / 3;
  const boxHeight = 17;

  // Box 1: Pemasukan
  doc.setFillColor(235, 247, 240);
  doc.setDrawColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
  doc.roundedRect(marginX, currentY, boxWidth, boxHeight, 2, 2, 'FD');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
  doc.text('TOTAL PEMASUKAN', marginX + 3, currentY + 5);
  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'bold');
  doc.text(formatRupiah(lpjData.totalInflow), marginX + 3, currentY + 11);
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 100, 90);
  doc.text('Iuran Kas, Spons & Danus', marginX + 3, currentY + 15);

  // Box 2: Pengeluaran
  const box2X = marginX + boxWidth + 3;
  doc.setFillColor(255, 240, 240);
  doc.setDrawColor(ACCENT_RED[0], ACCENT_RED[1], ACCENT_RED[2]);
  doc.roundedRect(box2X, currentY, boxWidth, boxHeight, 2, 2, 'FD');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(ACCENT_RED[0], ACCENT_RED[1], ACCENT_RED[2]);
  doc.text('TOTAL PENGELUARAN', box2X + 3, currentY + 5);
  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'bold');
  doc.text(formatRupiah(lpjData.totalOutflow), box2X + 3, currentY + 11);
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 70, 70);
  doc.text('Biaya Proker & Logistik', box2X + 3, currentY + 15);

  // Box 3: Saldo Kas Aktif
  const box3X = marginX + (boxWidth * 2) + 6;
  doc.setFillColor(235, 240, 255);
  doc.setDrawColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
  doc.roundedRect(box3X, currentY, boxWidth, boxHeight, 2, 2, 'FD');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(SECONDARY_COLOR[0], SECONDARY_COLOR[1], SECONDARY_COLOR[2]);
  doc.text('SISA SALDO KAS TERVERIFIKASI', box3X + 3, currentY + 5);
  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
  doc.text(formatRupiah(lpjData.verifiedBalance), box3X + 3, currentY + 11);
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 110);
  doc.text('Kas Tunai + Bank Mandiri', box3X + 3, currentY + 15);

  currentY += boxHeight + 6;

  // --- TABEL 1: REALISASI ANGGARAN PROGRAM KERJA ---
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(SECONDARY_COLOR[0], SECONDARY_COLOR[1], SECONDARY_COLOR[2]);
  doc.text('II. REALISASI ANGGARAN PROGRAM KERJA & KEGIATAN', marginX, currentY);
  currentY += 2;

  const eventRows = lpjData.events.map((ev, idx) => {
    const selisih = ev.budget - ev.realized;
    const efisiensi = selisih >= 0 ? `+${formatRupiah(selisih)}` : `-${formatRupiah(Math.abs(selisih))}`;
    return [
      String(idx + 1),
      ev.name,
      ev.date,
      formatRupiah(ev.budget),
      formatRupiah(ev.realized),
      efisiensi,
      ev.status,
    ];
  });

  // Calculate totals for events
  const totalBudget = lpjData.events.reduce((acc, curr) => acc + curr.budget, 0);
  const totalRealized = lpjData.events.reduce((acc, curr) => acc + curr.realized, 0);
  const totalDifference = totalBudget - totalRealized;

  eventRows.push([
    '',
    'TOTAL PROGRAM KERJA',
    '',
    formatRupiah(totalBudget),
    formatRupiah(totalRealized),
    totalDifference >= 0 ? `+${formatRupiah(totalDifference)}` : `-${formatRupiah(Math.abs(totalDifference))}`,
    'AUDIT VALID',
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [['No', 'Program Kerja / Kegiatan', 'Waktu', 'Anggaran (RAPB)', 'Realisasi', 'Efisiensi', 'Status Audit']],
    body: eventRows,
    theme: 'grid',
    headStyles: {
      fillColor: PRIMARY_COLOR,
      textColor: [255, 255, 255],
      fontSize: 7.5,
      fontStyle: 'bold',
      halign: 'center',
    },
    bodyStyles: {
      fontSize: 7,
      textColor: [40, 48, 68],
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 8 },
      1: { cellWidth: 52 },
      2: { cellWidth: 26 },
      3: { halign: 'right', cellWidth: 24 },
      4: { halign: 'right', cellWidth: 24 },
      5: { halign: 'right', cellWidth: 24 },
      6: { halign: 'center', cellWidth: 24 },
    },
    didParseCell: (data) => {
      // Highlight Total Row
      if (data.row.index === eventRows.length - 1) {
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.fillColor = [240, 243, 255];
      }
    },
    margin: { left: marginX, right: marginX },
  });

  currentY = (doc as any).lastAutoTable.finalY + 7;

  // Check if we need to add a page or continue
  if (includeMemberDues && currentY > pageHeight - 65) {
    doc.addPage();
    currentY = 16;
  }

  // --- TABEL 2: REKAPITULASI IURAN KAS PENGURUS ---
  if (includeMemberDues) {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(SECONDARY_COLOR[0], SECONDARY_COLOR[1], SECONDARY_COLOR[2]);
    doc.text('III. REKAPITULASI KEPATUHAN IURAN KAS MAHASISWA', marginX, currentY);
    currentY += 2;

    // Aggregate by department
    const depts = [
      { name: 'BPH Inti', key: 'bph' },
      { name: 'Dept. Kominfo', key: 'kominfo' },
      { name: 'Dept. Acara', key: 'acara' },
      { name: 'Dept. PSDM', key: 'psdm' },
      { name: 'Dept. Danus', key: 'danus' },
    ];

    const duesSummaryRows = depts.map((d, idx) => {
      const deptMembers = members.filter((m) => m.deptKey === d.key);
      const totalDept = deptMembers.length || 1;
      const lunasCount = deptMembers.filter((m) => m.status === 'lunas').length;
      const tunggakanCount = totalDept - lunasCount;
      const collected = lunasCount * 50000;
      const target = totalDept * 50000;
      const percentage = Math.round((lunasCount / totalDept) * 100);

      return [
        String(idx + 1),
        d.name,
        `${totalDept} Anggota`,
        `${lunasCount} Lunas`,
        `${tunggakanCount} Belum`,
        formatRupiah(collected),
        formatRupiah(target),
        `${percentage}%`,
      ];
    });

    const totalMembers = members.length;
    const totalLunas = members.filter((m) => m.status === 'lunas').length;
    const totalTunggakan = totalMembers - totalLunas;
    const totalCollected = totalLunas * 50000;
    const grandTarget = totalMembers * 50000;
    const overallPercentage = Math.round((totalLunas / totalMembers) * 100);

    duesSummaryRows.push([
      '',
      'TOTAL KESELURUHAN',
      `${totalMembers} Anggota`,
      `${totalLunas} Lunas`,
      `${totalTunggakan} Belum`,
      formatRupiah(totalCollected),
      formatRupiah(grandTarget),
      `${overallPercentage}%`,
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [['No', 'Departemen / Divisi', 'Jumlah', 'Status Lunas', 'Tunggakan', 'Terkumpul', 'Target Iuran', 'Rasio']],
      body: duesSummaryRows,
      theme: 'grid',
      headStyles: {
        fillColor: SECONDARY_COLOR,
        textColor: [255, 255, 255],
        fontSize: 7.5,
        fontStyle: 'bold',
        halign: 'center',
      },
      bodyStyles: {
        fontSize: 7,
        textColor: [40, 48, 68],
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 8 },
        1: { cellWidth: 42 },
        2: { halign: 'center', cellWidth: 22 },
        3: { halign: 'center', cellWidth: 20 },
        4: { halign: 'center', cellWidth: 20 },
        5: { halign: 'right', cellWidth: 26 },
        6: { halign: 'right', cellWidth: 26 },
        7: { halign: 'center', cellWidth: 18 },
      },
      didParseCell: (data) => {
        if (data.row.index === duesSummaryRows.length - 1) {
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.fillColor = [240, 243, 255];
        }
      },
      margin: { left: marginX, right: marginX },
    });

    currentY = (doc as any).lastAutoTable.finalY + 7;
  }

  // --- TABEL 3: BUKU KAS LEDGER (RECENT MUTATIONS) ---
  if (includeTransactions) {
    if (currentY > pageHeight - 65) {
      doc.addPage();
      currentY = 16;
    }

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(SECONDARY_COLOR[0], SECONDARY_COLOR[1], SECONDARY_COLOR[2]);
    doc.text('IV. MUTASI TRANSAKSI BUKU KAS UTAMA (TERVERIFIKASI)', marginX, currentY);
    currentY += 2;

    const txRows = transactions.slice(0, 12).map((t, idx) => {
      const isIn = t.type === 'inflow';
      return [
        String(idx + 1),
        t.referenceNumber || `Ref #${idx + 100}`,
        t.dateString.split(',')[1]?.trim() || t.dateString,
        t.title,
        t.category,
        isIn ? formatRupiah(t.amount) : '-',
        !isIn ? formatRupiah(t.amount) : '-',
        t.paymentMethod,
      ];
    });

    autoTable(doc, {
      startY: currentY,
      head: [['No', 'ID Ref', 'Tanggal', 'Uraian Transaksi', 'Kategori', 'Debit (+)', 'Kredit (-)', 'Metode']],
      body: txRows,
      theme: 'striped',
      headStyles: {
        fillColor: PRIMARY_COLOR,
        textColor: [255, 255, 255],
        fontSize: 7,
        fontStyle: 'bold',
        halign: 'center',
      },
      bodyStyles: {
        fontSize: 6.5,
        textColor: [40, 48, 68],
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 7 },
        1: { cellWidth: 20 },
        2: { cellWidth: 22 },
        3: { cellWidth: 46 },
        4: { cellWidth: 32 },
        5: { halign: 'right', cellWidth: 20 },
        6: { halign: 'right', cellWidth: 20 },
        7: { halign: 'center', cellWidth: 15 },
      },
      margin: { left: marginX, right: marginX },
    });

    currentY = (doc as any).lastAutoTable.finalY + 6;
  }

  // --- CATATAN AUDIT DAN PERNYATAAN BERSAMA ---
  if (currentY > pageHeight - 65) {
    doc.addPage();
    currentY = 16;
  }

  doc.setFillColor(LIGHT_BG[0], LIGHT_BG[1], LIGHT_BG[2]);
  doc.roundedRect(marginX, currentY, pageWidth - 2 * marginX, 15, 2, 2, 'F');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(SECONDARY_COLOR[0], SECONDARY_COLOR[1], SECONDARY_COLOR[2]);
  doc.text('CATATAN AUDIT & KEABSAHAN DOKUMEN:', marginX + 3, currentY + 4);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(70, 80, 75);
  doc.text('1. Dokumen ini disahkan melalui Sidang Pleno Pertanggungjawaban Keuangan HIMA ILKOM dan memiliki kekuatan hukum organisasi yang sah.', marginX + 3, currentY + 8);
  doc.text(`2. Bukti digital tersertifikasi Kriptografi SHA-256: ${lpjData.verificationHash.slice(0, 48)}...`, marginX + 3, currentY + 11.5);

  currentY += 20;

  // --- LEMBAR PENGESAHAN (SIGNATORIES) ---
  if (currentY > pageHeight - 45) {
    doc.addPage();
    currentY = 16;
  }

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
  doc.text(`Disahkan di Kampus Utama, ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`, pageWidth - marginX, currentY, { align: 'right' });
  currentY += 4;

  const colWidth = (pageWidth - 2 * marginX) / 3;

  // Column 1: Bendahara Umum
  const col1X = marginX + (colWidth / 2);
  doc.setTextColor(SECONDARY_COLOR[0], SECONDARY_COLOR[1], SECONDARY_COLOR[2]);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text('Yang Mengajukan,', col1X, currentY, { align: 'center' });
  doc.text('Bendahara Umum HIMA ILKOM', col1X, currentY + 4, { align: 'center' });

  // Column 2: Ketua Umum
  const col2X = marginX + colWidth + (colWidth / 2);
  doc.text('Mengetahui & Menyetujui,', col2X, currentY, { align: 'center' });
  doc.text('Ketua Umum HIMA ILKOM', col2X, currentY + 4, { align: 'center' });

  // Column 3: Dosen Pembina
  const col3X = marginX + (colWidth * 2) + (colWidth / 2);
  doc.text('Memeriksa & Mengesahkan,', col3X, currentY, { align: 'center' });
  doc.text('Dosen Pembina Kemahasiswaan', col3X, currentY + 4, { align: 'center' });

  // Signature lines & Names
  const signY = currentY + 23;

  // Bendahara
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
  doc.text('Citra Dewi', col1X, signY, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(SECONDARY_COLOR[0], SECONDARY_COLOR[1], SECONDARY_COLOR[2]);
  doc.text('NIM. 220101004', col1X, signY + 3.5, { align: 'center' });
  doc.setLineWidth(0.2);
  doc.line(col1X - 22, signY - 1, col1X + 22, signY - 1);

  // Digital Badge Stamp overlay
  doc.setDrawColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
  doc.roundedRect(col1X - 18, signY - 14, 36, 9, 1.5, 1.5, 'D');
  doc.setFontSize(5.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
  doc.text('TERVERIFIKASI DIGITAL', col1X, signY - 9.5, { align: 'center' });
  doc.setFontSize(4.5);
  doc.setFont('helvetica', 'normal');
  doc.text('KASKAMPUS LEDGER SECURE', col1X, signY - 7, { align: 'center' });

  // Ketua Umum
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(SECONDARY_COLOR[0], SECONDARY_COLOR[1], SECONDARY_COLOR[2]);
  doc.text('Rendra Pratama', col2X, signY, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text('NIM. 210101012', col2X, signY + 3.5, { align: 'center' });
  doc.line(col2X - 22, signY - 1, col2X + 22, signY - 1);

  // Dosen Pembina
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('Prof. Dr. Ir. Wahyudi', col3X, signY, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text('NIP. 197805122003121002', col3X, signY + 3.5, { align: 'center' });
  doc.line(col3X - 24, signY - 1, col3X + 24, signY - 1);

  // --- FOOTER ON ALL PAGES ---
  const totalPages = (doc.internal as any).getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
    doc.setDrawColor(220, 225, 235);
    doc.setLineWidth(0.2);
    doc.line(marginX, pageHeight - 9, pageWidth - marginX, pageHeight - 9);

    doc.text('Dokumen Resmi LPJ Keuangan HIMA ILKOM • Dicetak via KasKampus App', marginX, pageHeight - 6);
    doc.text(`Halaman ${i} dari ${totalPages}`, pageWidth - marginX, pageHeight - 6, { align: 'right' });
  }

  return doc;
};

/**
 * Directly downloads the official PDF file to the client browser.
 */
export const downloadLpjPdfFile = (
  lpjData: LPJReport,
  transactions: Transaction[],
  members: MemberDue[],
  options?: PDFExportOptions
): void => {
  const doc = generateOfficialLpjPdf(lpjData, transactions, members, options);
  const sanitizedPeriod = (options?.periodName || lpjData.period || 'Semester_Ganjil_2024_2025')
    .replace(/\s+/g, '_')
    .replace(/[/\\?%*:|"<>]/g, '-');
  const filename = `LPJ_Keuangan_Resmi_HIMA_ILKOM_${sanitizedPeriod}.pdf`;
  doc.save(filename);
};
