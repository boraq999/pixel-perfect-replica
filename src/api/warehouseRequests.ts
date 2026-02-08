// API functions for Warehouse Keeper - Marketer Requests Management
import axiosInstance from './axiosInstance';

export interface WarehouseRequestFilters {
    status?: 'pending' | 'approved' | 'rejected' | 'documented' | 'cancelled';
    marketer_id?: number;
    from_date?: string;
    to_date?: string;
    page?: number;
}

export interface WarehouseRequestItem {
    id: number;
    product_id: number;
    product_name: string;
    quantity: number;
    current_price: number;
}

export interface WarehouseRequest {
    id: number;
    invoice_number: string;
    marketer_id: number;
    marketer_name: string;
    status: 'pending' | 'approved' | 'rejected' | 'documented' | 'cancelled';
    created_at: string;
    approved_at: string | null;
    approved_by: number | null;
    approver_name: string | null;
    rejected_at: string | null;
    rejected_by: number | null;
    rejecter_name: string | null;
    documented_at: string | null;
    documented_by: number | null;
    documenter_name: string | null;
    cancelled_at: string | null;
    cancelled_by: number | null;
    canceller_name: string | null;
    approval_notes: string | null;
    rejection_notes: string | null;
    cancellation_notes: string | null;
    documentation_image: string | null;
    stamped_image: string | null;
    updated_at: string;
    notes?: string | null;
}

export interface WarehouseRequestDetails {
    request: WarehouseRequest;
    items: WarehouseRequestItem[];
}

export interface WarehouseRequestsResponse {
    message: string;
    data: {
        current_page: number;
        data: WarehouseRequest[];
        first_page_url: string;
        from: number;
        last_page: number;
        last_page_url: string;
        next_page_url: string | null;
        path: string;
        per_page: number;
        prev_page_url: string | null;
        to: number;
        total: number;
    };
}

export interface WarehouseRequestDetailsResponse {
    success: boolean;
    data: WarehouseRequestDetails;
}

export interface UpdateRequestResponse {
    success: boolean;
    message: string;
    data: WarehouseRequest;
}

// Response format that the component expects
export interface PaginatedRequestsResponse {
    data: WarehouseRequest[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export const warehouseRequestsAPI = {
    // Get all requests (with filters)
    getRequests: async (filters: WarehouseRequestFilters = {}): Promise<PaginatedRequestsResponse> => {
        try {
            const params = new URLSearchParams();

            if (filters.status) params.append('status', filters.status);
            if (filters.marketer_id) params.append('marketer_id', filters.marketer_id.toString());
            if (filters.from_date) params.append('from_date', filters.from_date);
            if (filters.to_date) params.append('to_date', filters.to_date);
            if (filters.page) params.append('page', filters.page.toString());

            const url = `/warehouse/requests${params.toString() ? `?${params.toString()}` : ''}`;
            console.log('🌐 API GET:', url);

            const response = await axiosInstance.get<WarehouseRequestsResponse>(url);

            console.log('✅ Received', response.data.data.data.length, 'requests, total:', response.data.data.total);

            // Return in the format expected by the component
            return {
                data: response.data.data.data,
                current_page: response.data.data.current_page,
                last_page: response.data.data.last_page,
                per_page: response.data.data.per_page,
                total: response.data.data.total,
            };
        } catch (error: any) {
            console.error('❌ API Error:', error.response?.data?.message || error.message);
            throw error;
        }
    },

    // Get request details
    getRequestDetails: async (id: number) => {
        try {
            console.log('🌐 API GET:', `/warehouse/requests/${id}`);
            const response = await axiosInstance.get<WarehouseRequestDetailsResponse>(
                `/warehouse/requests/${id}`
            );
            console.log('✅ Received details for request:', id);
            console.log('📄 Request structure:', response.data.data.request);
            return response.data;
        } catch (error: any) {
            console.error('❌ Failed to get details:', error.response?.data || error.message);
            throw error;
        }
    },

    // Approve request
    approveRequest: async (id: number) => {
        const response = await axiosInstance.put<UpdateRequestResponse>(
            `/warehouse/requests/${id}/approve`
        );
        return response.data;
    },

    // Reject request
    rejectRequest: async (id: number, notes: string) => {
        const response = await axiosInstance.put<UpdateRequestResponse>(
            `/warehouse/requests/${id}/reject`,
            { notes }
        );
        return response.data;
    },

    // Document request (with image upload)
    documentRequest: async (id: number, image: File) => {
        try {
            const formData = new FormData();
            formData.append('stamped_image', image);

            console.log('📤 Uploading document for request:', id);
            console.log('📎 Image file:', image.name, 'Field: stamped_image');

            // نقوم بمسح الـ Content-Type الافتراضي لضمان أن المتصفح سيضع multipart/form-data مع الـ boundary الصحيح
            const response = await axiosInstance.post<UpdateRequestResponse>(
                `/warehouse/requests/${id}/document`,
                formData,
                {
                    headers: {
                        'Content-Type': undefined, // هذا مهم جداً لرفع الملفات عند استخدام axios instance مهيأ مسبقاً بـ JSON
                    }
                }
            );

            console.log('✅ Document uploaded successfully');
            return response.data;
        } catch (error: any) {
            console.error('❌ Document upload failed:');
            console.error('Error details:', error.response?.data || error.message);
            throw error;
        }
    },

    // Cancel request
    cancelRequest: async (id: number, notes: string) => {
        const response = await axiosInstance.put<UpdateRequestResponse>(
            `/warehouse/requests/${id}/cancel`,
            { notes }
        );
        return response.data;
    },
};
