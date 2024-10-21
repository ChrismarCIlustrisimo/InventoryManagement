// PDFDocument.js
import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import SalesSummary from './reportsComponent/SalesSummary';
import RefundSummary from './reportsComponent/RefundSummary';
import SalesBreakdown from './reportsComponent/SalesBreakdown';
import PaymentMethods from './reportsComponent/PaymentMethods';
import VATSummary from './reportsComponent/VATSummary';
import SalesByCategory from './reportsComponent/SalesByCategory';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 30,
    fontSize: 12,
  },
  section: {
    marginBottom: 20,
    padding: 10,
    border: '1px solid #ccc',
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
  },
});

const SalesPDF = ({ filteredSalesData, reportIncluded }) => (
    
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>Sales Report</Text>
        <>
                  <SalesSummary salesData={filteredSalesData} />
                  <div className='flex flex-col gap-4'>
                  <SalesBreakdown salesData={filteredSalesData} />
                    {reportIncluded['Sales by Category'] && (<SalesByCategory salesData={filteredSalesData} />)}
                    {reportIncluded['Payment Method'] && (<PaymentMethods salesData={filteredSalesData} />)}
                    {reportIncluded['Refunds Summary'] && (<RefundSummary salesData={filteredSalesData} />)}
                    {reportIncluded['VAT Summary'] && (<VATSummary salesData={filteredSalesData} />)}
                  </div>
                </>
      </View>
    </Page>
  </Document>
);

export default SalesPDF;
