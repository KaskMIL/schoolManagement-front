import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer'
import Decimal from 'decimal.js'
import type { ReceiptData } from '../payments.types'

// -----------------------------------------------------------
// Helpers
// -----------------------------------------------------------

function formatMoney(amount: string): string {
  return (
    '$\u00a0' +
    new Decimal(amount)
      .toFixed(2)
      .replace('.', ',')
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  )
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-')
  return `${day}/${month}/${year}`
}

function padReceiptNumber(n: number, year: number): string {
  return `${String(n).padStart(4, '0')} / ${year}`
}

// -----------------------------------------------------------
// Estilos
// -----------------------------------------------------------

const BLUE = '#1971c2'
const DARK = '#212529'
const MUTED = '#868e96'
const LIGHT_BG = '#f8f9fa'
const BORDER = '#dee2e6'
const WHITE = '#ffffff'

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 9,
    color: DARK,
    paddingTop: 36,
    paddingBottom: 48,
    paddingHorizontal: 44,
  },

  // --- Encabezado ---
  header: {
    backgroundColor: BLUE,
    borderRadius: 4,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
  },
  headerInstitutionName: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: WHITE,
    marginBottom: 2,
  },
  headerInstitutionSub: {
    fontSize: 8,
    color: '#a5d8ff',
    marginBottom: 1,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  headerReceiptLabel: {
    fontSize: 8,
    color: '#a5d8ff',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  headerReceiptNumber: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: WHITE,
  },

  // --- Sección genérica ---
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: MUTED,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    paddingBottom: 3,
  },

  // --- Grilla de info ---
  infoRow: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  infoLabel: {
    width: 110,
    color: MUTED,
    fontSize: 8,
  },
  infoValue: {
    flex: 1,
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
  },

  // --- Tabla de detalles ---
  detailsHeader: {
    flexDirection: 'row',
    backgroundColor: LIGHT_BG,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: BORDER,
    paddingVertical: 4,
    paddingHorizontal: 6,
    marginTop: 6,
  },
  detailsHeaderText: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: MUTED,
    textTransform: 'uppercase',
  },
  detailRow: {
    flexDirection: 'row',
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  detailDescCol: {
    flex: 1,
    fontSize: 8,
  },
  detailAmountCol: {
    width: 80,
    fontSize: 8,
    textAlign: 'right',
  },

  // --- Totales ---
  totalsBlock: {
    marginTop: 6,
    alignItems: 'flex-end',
  },
  totalRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  totalLabel: {
    width: 110,
    fontSize: 8,
    color: MUTED,
    textAlign: 'right',
    paddingRight: 8,
  },
  totalValue: {
    width: 80,
    fontSize: 8,
    textAlign: 'right',
  },
  totalFinalLabel: {
    width: 110,
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'right',
    paddingRight: 8,
  },
  totalFinalValue: {
    width: 80,
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'right',
    color: BLUE,
  },

  // --- Pago ---
  paymentBox: {
    backgroundColor: LIGHT_BG,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 10,
    marginBottom: 12,
  },
  paymentAmount: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: BLUE,
    marginBottom: 4,
  },

  // --- Footer ---
  footer: {
    marginTop: 'auto',
    borderTopWidth: 1,
    borderTopColor: BORDER,
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  footerNote: {
    fontSize: 7,
    color: MUTED,
    fontStyle: 'italic',
  },
  footerReceiver: {
    fontSize: 8,
    color: MUTED,
    textAlign: 'right',
  },
  footerReceiverName: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: DARK,
  },
})

// -----------------------------------------------------------
// Componente
// -----------------------------------------------------------

interface ReceiptDocumentProps {
  data: ReceiptData
}

export function ReceiptDocument({ data }: ReceiptDocumentProps) {
  const hasDiscount = data.allocations.some(
    (a) => new Decimal(a.discountAmount).gt(0),
  )

  return (
    <Document
      title={`Recibo ${padReceiptNumber(data.receiptNumber, data.academicYear)}`}
      author="EscuelaGest"
    >
      <Page size="A4" style={styles.page}>

        {/* Encabezado azul con instituciones */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {data.institutions.length === 0 ? (
              <Text style={styles.headerInstitutionName}>EscuelaGest</Text>
            ) : (
              data.institutions.map((inst, i) => (
                <View key={i}>
                  <Text style={styles.headerInstitutionName}>{inst.name}</Text>
                  {inst.address && (
                    <Text style={styles.headerInstitutionSub}>{inst.address}</Text>
                  )}
                  {inst.phone && (
                    <Text style={styles.headerInstitutionSub}>Tel: {inst.phone}</Text>
                  )}
                </View>
              ))
            )}
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.headerReceiptLabel}>Recibo N°</Text>
            <Text style={styles.headerReceiptNumber}>
              {padReceiptNumber(data.receiptNumber, data.academicYear)}
            </Text>
          </View>
        </View>

        {/* Datos del pago y familia */}
        <View style={[styles.section, { flexDirection: 'row', gap: 16 }]}>
          <View style={{ flex: 1 }}>
            <Text style={styles.sectionTitle}>Recibido de</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Familia</Text>
              <Text style={styles.infoValue}>{data.family.name}</Text>
            </View>
            {data.primaryContact && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Responsable</Text>
                <Text style={styles.infoValue}>
                  {data.primaryContact.firstName} {data.primaryContact.lastName}
                </Text>
              </View>
            )}
            {data.family.address && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Dirección</Text>
                <Text style={styles.infoValue}>{data.family.address}</Text>
              </View>
            )}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.sectionTitle}>Fecha</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Fecha de emisión</Text>
              <Text style={styles.infoValue}>{formatDate(data.issuedDate)}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Fecha de pago</Text>
              <Text style={styles.infoValue}>{formatDate(data.paymentDate)}</Text>
            </View>
          </View>
        </View>

        {/* Detalle de cuotas */}
        {data.allocations.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Detalle</Text>
            {data.allocations.map((alloc, ai) => (
              <View key={ai} style={{ marginBottom: 10 }}>
                <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', marginBottom: 2 }}>
                  {alloc.installmentDescription}
                </Text>
                {/* Cabecera tabla */}
                <View style={styles.detailsHeader}>
                  <Text style={[styles.detailsHeaderText, { flex: 1 }]}>Concepto</Text>
                  <Text style={[styles.detailsHeaderText, { width: 80, textAlign: 'right' }]}>
                    Importe
                  </Text>
                </View>
                {/* Filas */}
                {alloc.details.map((detail, di) => (
                  <View key={di} style={styles.detailRow}>
                    <Text style={styles.detailDescCol}>{detail.description}</Text>
                    <Text style={styles.detailAmountCol}>{formatMoney(detail.finalAmount)}</Text>
                  </View>
                ))}
                {/* Totales de la cuota */}
                <View style={styles.totalsBlock}>
                  {hasDiscount && (
                    <>
                      <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Subtotal</Text>
                        <Text style={styles.totalValue}>{formatMoney(alloc.subtotal)}</Text>
                      </View>
                      <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Descuentos</Text>
                        <Text style={[styles.totalValue, { color: '#2f9e44' }]}>
                          -{formatMoney(alloc.discountAmount)}
                        </Text>
                      </View>
                    </>
                  )}
                  <View style={styles.totalRow}>
                    <Text style={styles.totalFinalLabel}>Total cuota</Text>
                    <Text style={styles.totalFinalValue}>{formatMoney(alloc.total)}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Detalle</Text>
            <View style={{ paddingVertical: 8 }}>
              <Text style={{ fontSize: 9, color: MUTED, fontStyle: 'italic' }}>
                Pago a cuenta — saldo a favor de la familia
              </Text>
            </View>
          </View>
        )}

        {/* Monto abonado */}
        <View style={styles.paymentBox}>
          <Text style={styles.paymentAmount}>{formatMoney(data.amount)}</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Método de pago</Text>
            <Text style={styles.infoValue}>{data.method}</Text>
          </View>
          {data.reference && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Referencia</Text>
              <Text style={styles.infoValue}>{data.reference}</Text>
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerNote}>
            Este comprobante no es válido como factura electrónica.
          </Text>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.footerReceiver}>Recibió</Text>
            <Text style={styles.footerReceiverName}>{data.receivedBy}</Text>
          </View>
        </View>

      </Page>
    </Document>
  )
}
