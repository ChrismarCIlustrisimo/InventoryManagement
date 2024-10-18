import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Define styles for the PDF, mimicking Tailwind CSS
const styles = StyleSheet.create({
    page: {
        padding: 30,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 20,
        marginBottom: 10,
        textAlign: 'center',
        fontWeight: 'bold', // Use 'bold' instead of 'semibold'
    },
    section: {
        marginBottom: 10,
    },
    text: {
        fontSize: 12,
        marginBottom: 5,
    },
    boldText: {
        fontWeight: 'bold', // Use 'bold' for bold text
        fontSize: 12,
    },
    signature: {
        marginTop: 40,
        textAlign: 'right',
        fontSize: 12,
    },
    divider: {
        marginVertical: 10,
        borderBottom: '1px solid #000',
    },
    signatureContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-end',
        padding: 20,
        width: '100%',
    },
    signatureContaine2: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 8,
        paddingBottom: 6,
        paddingLeft: 6,
        paddingRight: 8,  
        width: '30%',
    },
    signatureText: {
        borderBottomWidth: 2,
        borderBottomColor: '#000',
        textAlign: 'center',
        width: '100%',
        fontWeight: 'bold', // Updated from 'medium' to 'bold'
        marginBottom: 5,
        fontSize: 14,
        paddingTop: 6,
        paddingBottom: 6, 
    },
    authorizedText: {
        fontSize: 10, 
        fontStyle: 'italic',
        textAlign: 'center',
        marginBottom: 5,
    },
    dateText: {
        fontSize: 10, 
        fontStyle: 'italic',
        textAlign: 'center',
    },
});

// Create the PDF document
const RMAPDF = ({ rma }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View>
                <Text style={styles.title}>Return Merchandise Authorization</Text>
            </View>

            <View style={styles.divider} />

            {/* Business Information */}
            <View style={styles.section}>
                <Text style={styles.boldText}>Irig Computer Trading</Text>
                <Text style={styles.text}>23 Gen. Tinio St. Bgy 85, Caloocan, Philippines</Text>
                <Text style={styles.text}>Tel. No.: 8-364-6039</Text>
                <Text style={styles.text}>CP. No.: 0923-444-1030</Text>
                <Text style={styles.text}>Email: irigcomputers@gmail.com</Text>
            </View>

            <View style={styles.divider} />

            {/* RMA Details */}
            <View style={styles.section}>
                <Text style={styles.text}>
                    <Text style={styles.boldText}>RMA ID: </Text>
                    <Text>{rma?.rmaId}</Text>
                </Text>
                <Text style={styles.text}>
                    <Text style={styles.boldText}>Customer Name: </Text> {rma?.customerName}
                </Text>
                <Text style={styles.text}>
                    <Text style={styles.boldText}>Date Initiated: </Text> {rma?.date_initiated}
                </Text>
                <Text style={styles.text}>
                    <Text style={styles.boldText}>Product Name: </Text> {rma?.productName}
                </Text>
                <Text style={styles.text}>
                    <Text style={styles.boldText}>Serial Number: </Text> {rma?.serialNumber}
                </Text>
                <Text style={styles.text}>
                    <Text style={styles.boldText}>Reason for RMA: </Text> {rma?.reason}
                </Text>
            </View>

            <View style={styles.divider} />

            {/* Shipping and Instructions */}
            <View style={styles.section}>
                <Text style={styles.text}>
                    <Text style={styles.boldText}>Instructions:</Text>
                </Text>
                <Text style={styles.text}>
                    Please return the above item for repair or replacement.
                </Text>
                <Text style={styles.text}>
                    <Text style={styles.boldText}>Preferred Shipping Method:</Text> {rma?.shippingMethod || "Ground Shipping"}
                </Text>
            </View>

            <View style={styles.divider} />

            {/* Warranty Status */}
            <View style={styles.section}>
                <Text style={styles.text}>
                    <Text style={styles.boldText}>Warranty Status:</Text> {rma?.warrantyStatus || "Under Warranty"}
                </Text>
            </View>
            <View style={styles.divider} />

            <View style={styles.signatureContainer}>
                <View style={styles.signatureContaine2}>
                    <Text style={styles.signatureText}>Judith Villasin</Text>
                    <Text style={styles.authorizedText}>Authorized Person</Text>
                    <Text style={styles.dateText}>{new Date().toLocaleDateString()}</Text>
                </View>
            </View>
        </Page>
    </Document>
);

export default RMAPDF;
