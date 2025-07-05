// Dashboard JavaScript
class MDSLDashboard {
    constructor() {
        this.currentSection = 'overview';
        this.isLoggedIn = false;
        this.sampleData = this.generateSampleData();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkAuthStatus();
        this.updateNotificationBadges();
        this.startRealTimeUpdates();
    }

    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }

        // Navigation links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavigation(e));
        });

        // Sidebar toggle
        const sidebarToggle = document.getElementById('sidebarToggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => this.toggleSidebar());
        }

        // Refresh button
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refreshData());
        }

        // Notifications button
        const notificationsBtn = document.getElementById('notificationsBtn');
        if (notificationsBtn) {
            notificationsBtn.addEventListener('click', () => this.showNotifications());
        }

        // Filter events
        this.setupFilterEvents();
        
        // Action buttons
        this.setupActionButtons();
    }

    setupFilterEvents() {
        const statusFilter = document.getElementById('statusFilter');
        const serviceFilter = document.getElementById('serviceFilter');
        const searchOrders = document.getElementById('searchOrders');

        if (statusFilter) {
            statusFilter.addEventListener('change', () => this.filterOrders());
        }

        if (serviceFilter) {
            serviceFilter.addEventListener('change', () => this.filterOrders());
        }

        if (searchOrders) {
            searchOrders.addEventListener('input', () => this.filterOrders());
        }
    }

    setupActionButtons() {
        // Export buttons
        const exportOrders = document.getElementById('exportOrders');
        const exportCustomers = document.getElementById('exportCustomers');
        
        if (exportOrders) {
            exportOrders.addEventListener('click', () => this.exportData('orders'));
        }
        
        if (exportCustomers) {
            exportCustomers.addEventListener('click', () => this.exportData('customers'));
        }

        // Add buttons
        const addOrder = document.getElementById('addOrder');
        const addCustomer = document.getElementById('addCustomer');
        
        if (addOrder) {
            addOrder.addEventListener('click', () => this.showAddOrderModal());
        }
        
        if (addCustomer) {
            addCustomer.addEventListener('click', () => this.showAddCustomerModal());
        }

        // Mark all read
        const markAllRead = document.getElementById('markAllRead');
        if (markAllRead) {
            markAllRead.addEventListener('click', () => this.markAllNotificationsRead());
        }
    }

    handleLogin(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Simple authentication (in production, use proper authentication)
        if (username === 'admin' && password === 'mdsl2025') {
            this.isLoggedIn = true;
            localStorage.setItem('mdsl_admin_logged_in', 'true');
            this.showDashboard();
            this.showSuccessNotification('Welcome back, Admin!');
        } else {
            this.showErrorNotification('Invalid credentials. Please try again.');
            this.shakeLoginForm();
        }
    }

    handleLogout() {
        this.isLoggedIn = false;
        localStorage.removeItem('mdsl_admin_logged_in');
        this.showLoginScreen();
        this.showSuccessNotification('Logged out successfully');
    }

    checkAuthStatus() {
        const isLoggedIn = localStorage.getItem('mdsl_admin_logged_in');
        if (isLoggedIn === 'true') {
            this.isLoggedIn = true;
            this.showDashboard();
        } else {
            this.showLoginScreen();
        }
    }

    showLoginScreen() {
        document.getElementById('loginScreen').classList.remove('hidden');
        document.getElementById('dashboard').classList.add('hidden');
    }

    showDashboard() {
        document.getElementById('loginScreen').classList.add('hidden');
        document.getElementById('dashboard').classList.remove('hidden');
        this.loadDashboardData();
    }

    shakeLoginForm() {
        const loginContainer = document.querySelector('.login-container');
        loginContainer.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            loginContainer.style.animation = '';
        }, 500);
    }

    handleNavigation(e) {
        e.preventDefault();
        
        const section = e.currentTarget.dataset.section;
        if (section) {
            this.switchSection(section);
        }
    }

    switchSection(section) {
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-section="${section}"]`).classList.add('active');

        // Update content sections
        document.querySelectorAll('.content-section').forEach(sec => {
            sec.classList.remove('active');
        });
        document.getElementById(`${section}Section`).classList.add('active');

        // Update page title
        this.updatePageTitle(section);
        this.currentSection = section;

        // Load section-specific data
        this.loadSectionData(section);
    }

    updatePageTitle(section) {
        const titles = {
            overview: { title: 'Dashboard Overview', subtitle: 'Welcome back! Here\'s what\'s happening with your business today.' },
            orders: { title: 'Order Management', subtitle: 'Track and manage all customer orders' },
            customers: { title: 'Customer Management', subtitle: 'Manage customer relationships and history' },
            income: { title: 'Income Management', subtitle: 'Track revenue, expenses, and profitability' },
            inventory: { title: 'Inventory Management', subtitle: 'Manage stock levels and spare parts' },
            analytics: { title: 'Analytics & Reports', subtitle: 'Detailed insights and performance metrics' },
            notifications: { title: 'Notifications', subtitle: 'Stay updated with important alerts and messages' },
            settings: { title: 'Settings', subtitle: 'Configure your dashboard preferences' }
        };

        const titleData = titles[section] || titles.overview;
        document.getElementById('pageTitle').textContent = titleData.title;
        document.getElementById('pageSubtitle').textContent = titleData.subtitle;
    }

    toggleSidebar() {
        const sidebar = document.querySelector('.sidebar');
        sidebar.classList.toggle('active');
    }

    loadDashboardData() {
        this.loadOrdersTable();
        this.updateStats();
        this.loadCustomers();
        this.loadNotifications();
    }

    loadSectionData(section) {
        switch (section) {
            case 'orders':
                this.loadOrdersTable();
                break;
            case 'customers':
                this.loadCustomers();
                break;
            case 'income':
                this.loadIncomeData();
                break;
            case 'notifications':
                this.loadNotifications();
                break;
            default:
                break;
        }
    }

    loadOrdersTable() {
        const tbody = document.getElementById('ordersTableBody');
        if (!tbody) return;

        tbody.innerHTML = '';
        
        this.sampleData.orders.forEach(order => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${order.id}</strong></td>
                <td>${order.customer}</td>
                <td>${order.service}</td>
                <td>${order.date}</td>
                <td><span class="status-badge ${order.status.toLowerCase().replace(' ', '-')}">${order.status}</span></td>
                <td><strong>$${order.amount}</strong></td>
                <td>
                    <button class="btn-small" onclick="dashboard.viewOrder('${order.id}')">View</button>
                    <button class="btn-small" onclick="dashboard.editOrder('${order.id}')">Edit</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    filterOrders() {
        const statusFilter = document.getElementById('statusFilter')?.value || '';
        const serviceFilter = document.getElementById('serviceFilter')?.value || '';
        const searchTerm = document.getElementById('searchOrders')?.value.toLowerCase() || '';

        let filteredOrders = this.sampleData.orders;

        if (statusFilter) {
            filteredOrders = filteredOrders.filter(order => 
                order.status.toLowerCase().replace(' ', '-') === statusFilter
            );
        }

        if (serviceFilter) {
            filteredOrders = filteredOrders.filter(order => 
                order.service.toLowerCase().includes(serviceFilter)
            );
        }

        if (searchTerm) {
            filteredOrders = filteredOrders.filter(order => 
                order.id.toLowerCase().includes(searchTerm) ||
                order.customer.toLowerCase().includes(searchTerm) ||
                order.service.toLowerCase().includes(searchTerm)
            );
        }

        this.displayFilteredOrders(filteredOrders);
    }

    displayFilteredOrders(orders) {
        const tbody = document.getElementById('ordersTableBody');
        if (!tbody) return;

        tbody.innerHTML = '';
        
        orders.forEach(order => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${order.id}</strong></td>
                <td>${order.customer}</td>
                <td>${order.service}</td>
                <td>${order.date}</td>
                <td><span class="status-badge ${order.status.toLowerCase().replace(' ', '-')}">${order.status}</span></td>
                <td><strong>$${order.amount}</strong></td>
                <td>
                    <button class="btn-small" onclick="dashboard.viewOrder('${order.id}')">View</button>
                    <button class="btn-small" onclick="dashboard.editOrder('${order.id}')">Edit</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    loadCustomers() {
        // Customer data is already in HTML, but we can add dynamic functionality here
        console.log('Loading customers data...');
    }

    loadIncomeData() {
        // Income data is already in HTML, but we can add dynamic functionality here
        console.log('Loading income data...');
    }

    loadNotifications() {
        // Notifications are already in HTML, but we can add dynamic functionality here
        this.updateNotificationBadges();
    }

    updateStats() {
        // Update real-time stats in header
        const stats = this.calculateStats();
        
        // Update header stats if elements exist
        const todayRevenue = document.querySelector('.stat-value');
        const activeOrders = document.querySelectorAll('.stat-value')[1];
        
        if (todayRevenue) {
            todayRevenue.textContent = `$${stats.todayRevenue.toLocaleString()}`;
        }
        
        if (activeOrders) {
            activeOrders.textContent = stats.activeOrders;
        }
    }

    calculateStats() {
        const today = new Date().toDateString();
        const todayOrders = this.sampleData.orders.filter(order => 
            new Date(order.date).toDateString() === today
        );
        
        const todayRevenue = todayOrders.reduce((sum, order) => sum + order.amount, 0);
        const activeOrders = this.sampleData.orders.filter(order => 
            order.status === 'Pending' || order.status === 'In Progress'
        ).length;

        return { todayRevenue, activeOrders };
    }

    updateNotificationBadges() {
        const unreadNotifications = this.sampleData.notifications.filter(n => !n.read).length;
        const newOrders = this.sampleData.orders.filter(o => o.status === 'Pending').length;

        const ordersBadge = document.getElementById('ordersBadge');
        const notificationsBadge = document.getElementById('notificationsBadge');

        if (ordersBadge) {
            ordersBadge.textContent = newOrders;
            ordersBadge.style.display = newOrders > 0 ? 'block' : 'none';
        }

        if (notificationsBadge) {
            notificationsBadge.textContent = unreadNotifications;
            notificationsBadge.style.display = unreadNotifications > 0 ? 'block' : 'none';
        }
    }

    refreshData() {
        this.showSuccessNotification('Data refreshed successfully');
        this.loadDashboardData();
        
        // Add refresh animation
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                refreshBtn.style.transform = '';
            }, 500);
        }
    }

    showNotifications() {
        this.switchSection('notifications');
    }

    // Action Methods
    viewOrder(orderId) {
        this.showSuccessNotification(`Viewing order ${orderId}`);
        // In a real app, this would open a detailed order view
    }

    editOrder(orderId) {
        this.showSuccessNotification(`Editing order ${orderId}`);
        // In a real app, this would open an edit form
    }

    exportData(type) {
        this.showSuccessNotification(`Exporting ${type} data...`);
        
        // Simulate export process
        setTimeout(() => {
            this.showSuccessNotification(`${type} data exported successfully`);
        }, 2000);
    }

    showAddOrderModal() {
        this.showSuccessNotification('Add Order modal would open here');
        // In a real app, this would open a modal form
    }

    showAddCustomerModal() {
        this.showSuccessNotification('Add Customer modal would open here');
        // In a real app, this would open a modal form
    }

    markAllNotificationsRead() {
        this.sampleData.notifications.forEach(notification => {
            notification.read = true;
        });
        
        // Update UI
        document.querySelectorAll('.notification-item.unread').forEach(item => {
            item.classList.remove('unread');
        });
        
        this.updateNotificationBadges();
        this.showSuccessNotification('All notifications marked as read');
    }

    // Notification System
    showSuccessNotification(message) {
        this.showNotification(message, 'success');
    }

    showErrorNotification(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `dashboard-notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--gradient-success)' : 'var(--gradient-accent)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: var(--shadow-xl);
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
            max-width: 350px;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        `;
        
        notification.innerHTML = `
            <span style="font-size: 1.2rem;">${type === 'success' ? '✅' : '⚠️'}</span>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Real-time Updates
    startRealTimeUpdates() {
        // Simulate real-time updates every 30 seconds
        setInterval(() => {
            if (this.isLoggedIn) {
                this.updateStats();
                this.simulateNewNotification();
            }
        }, 30000);
    }

    simulateNewNotification() {
        // Randomly add new notifications
        if (Math.random() > 0.7) {
            const newNotification = {
                id: `notif-${Date.now()}`,
                type: 'order',
                title: 'New Order Received',
                message: 'A new order has been submitted',
                time: 'Just now',
                read: false
            };
            
            this.sampleData.notifications.unshift(newNotification);
            this.updateNotificationBadges();
            
            if (this.currentSection === 'notifications') {
                this.loadNotifications();
            }
        }
    }

    // Sample Data Generation
    generateSampleData() {
        return {
            orders: [
                {
                    id: 'ORD-001',
                    customer: 'John Smith',
                    service: 'Car Repair',
                    date: '2025-01-15',
                    status: 'Pending',
                    amount: 450
                },
                {
                    id: 'ORD-002',
                    customer: 'Sarah Johnson',
                    service: 'Spare Parts',
                    date: '2025-01-14',
                    status: 'In Progress',
                    amount: 230
                },
                {
                    id: 'ORD-003',
                    customer: 'Mike Wilson',
                    service: 'Import/Export',
                    date: '2025-01-13',
                    status: 'Completed',
                    amount: 2500
                },
                {
                    id: 'ORD-004',
                    customer: 'Emily Davis',
                    service: 'Maintenance',
                    date: '2025-01-12',
                    status: 'Completed',
                    amount: 180
                },
                {
                    id: 'ORD-005',
                    customer: 'Robert Brown',
                    service: 'Car Repair',
                    date: '2025-01-11',
                    status: 'Cancelled',
                    amount: 320
                }
            ],
            notifications: [
                {
                    id: 'notif-1',
                    type: 'order',
                    title: 'New Order Received',
                    message: 'John Smith submitted a car repair request',
                    time: '2 minutes ago',
                    read: false
                },
                {
                    id: 'notif-2',
                    type: 'payment',
                    title: 'Payment Received',
                    message: 'Payment of $450 received for Order #ORD-001',
                    time: '15 minutes ago',
                    read: false
                },
                {
                    id: 'notif-3',
                    type: 'inventory',
                    title: 'Low Inventory Alert',
                    message: 'Brake pads inventory is running low',
                    time: '1 hour ago',
                    read: true
                },
                {
                    id: 'notif-4',
                    type: 'review',
                    title: 'New Customer Review',
                    message: 'Sarah Johnson left a 5-star review',
                    time: '3 hours ago',
                    read: true
                },
                {
                    id: 'notif-5',
                    type: 'system',
                    title: 'System Update',
                    message: 'Dashboard updated to version 2.1',
                    time: '1 day ago',
                    read: true
                }
            ]
        };
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new MDSLDashboard();
});

// Export for global access
window.MDSLDashboard = MDSLDashboard;