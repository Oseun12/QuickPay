import axios from 'axios';

export const processPayment = async (amount: number, paymentDetails: any) => {
    // Example using a payment gateway API
    try {
        const response = await axios.post('/', {
            amount,
            ...paymentDetails
        });

        if (response.data.success) {
            return {
                status: 'success',
                transactionId: response.data.transactionId
            };
        } else {
            return {
                status: 'failed',
                error: response.data.error
            };
        }
    } catch (error) {
        return {
            status: 'failed',
            // error: error.message
        };
    }
};
