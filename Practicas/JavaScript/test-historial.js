// ============================================================
// test-historial.js - Script para probar el sistema
// ============================================================

function testOrderSystem() {
    console.log('=== TEST DEL SISTEMA DE HISTORIAL ===');
    
    // Test 1: Verificar que orderHistory existe
    if (typeof orderHistory === 'undefined') {
        console.error('❌ orderHistory no está definido');
        return false;
    }
    console.log('✅ orderHistory está definido');
    
    // Test 2: Verificar que el carrito tiene items
    const cart = localStorage.getItem('shoppingCart');
    if (!cart) {
        console.warn('⚠️  No hay carrito en localStorage');
    } else {
        const cartItems = JSON.parse(cart);
        console.log(`✅ Carrito con ${cartItems.length} items:`, cartItems);
    }
    
    // Test 3: Verificar que selectedAddress está definida
    if (typeof selectedAddress === 'undefined') {
        console.warn('⚠️  selectedAddress no está definido (selecciona una dirección)');
    } else {
        console.log('✅ selectedAddress definida:', selectedAddress);
    }
    
    // Test 4: Crear un pedido de prueba
    console.log('\n--- Test de creación de pedido ---');
    
    const testOrder = {
        items: [
            { id: 1, name: 'Test Item', price: 10.00, quantity: 2 }
        ],
        subtotal: 20.00,
        shipping: 2.99,
        service: 3.00,
        total: 25.99,
        address: { label: 'Casa', address: 'Calle Test 123' },
        paymentMethod: 'card'
    };
    
    const savedOrder = orderHistory.addOrder(testOrder);
    console.log('✅ Pedido guardado:', savedOrder);
    
    // Test 5: Verificar que se guardó en localStorage
    const storedOrders = localStorage.getItem('userOrders');
    if (!storedOrders) {
        console.error('❌ No se guardó en userOrders');
    } else {
        const orders = JSON.parse(storedOrders);
        console.log(`✅ ${orders.length} pedidos en localStorage:`, orders);
    }
    
    // Test 6: Renderizar historial
    console.log('\n--- Test de renderizado ---');
    orderHistory.renderOrderHistory();
    console.log('✅ Historial renderizado');
    
    console.log('\n=== TEST COMPLETADO ===');
    return true;
}

// Ejecutar al cargar
document.addEventListener('DOMContentLoaded', () => {
    console.log('Para probar, ejecuta: testOrderSystem()');
});
