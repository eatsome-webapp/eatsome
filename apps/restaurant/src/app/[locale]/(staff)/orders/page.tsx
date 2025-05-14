import { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/server';

export default async function StaffOrdersPage({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  const dict = await getDictionary(locale as Locale, 'staff');

  // Sample orders data - in a real app, this would come from your database
  const orders = [
    { id: '1001', table: '5', items: 3, status: 'new', time: '5m ago' },
    { id: '1002', table: '8', items: 2, status: 'preparing', time: '12m ago' },
    { id: '1003', table: '2', items: 4, status: 'ready', time: '18m ago' },
    { id: '1004', table: 'Takeaway', items: 1, status: 'new', time: '2m ago' },
    { id: '1005', table: '3', items: 5, status: 'preparing', time: '15m ago' },
  ];

  // Function to get status class based on status
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-yellow-100 text-yellow-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'delivered':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{dict.orders.title}</h1>
        
        <div className="flex space-x-2">
          <div className="bg-white p-2 rounded-md shadow-sm">
            <span className="font-medium">{dict.orders.newOrders}: </span>
            <span className="text-blue-600 font-bold">2</span>
          </div>
          <div className="bg-white p-2 rounded-md shadow-sm">
            <span className="font-medium">{dict.orders.preparing}: </span>
            <span className="text-yellow-600 font-bold">2</span>
          </div>
          <div className="bg-white p-2 rounded-md shadow-sm">
            <span className="font-medium">{dict.orders.ready}: </span>
            <span className="text-green-600 font-bold">1</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
              <div>
                <span className="font-medium">{dict.orders.order} #{order.id}</span>
                <span className="ml-3 text-sm text-gray-500">{order.time}</span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(order.status)}`}>
                {dict.orders.status[order.status]}
              </span>
            </div>
            
            <div className="p-4">
              <div className="flex justify-between mb-3">
                <div>
                  <span className="text-gray-500">{dict.orders.table}: </span>
                  <span className="font-medium">{order.table}</span>
                </div>
                <div>
                  <span className="text-gray-500">{dict.orders.items}: </span>
                  <span className="font-medium">{order.items}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <button className="w-full py-2 bg-primary text-white rounded-md hover:bg-primary-dark">
                  {dict.orders.viewDetails}
                </button>
                
                {order.status === 'new' && (
                  <button className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                    {dict.orders.actions.accept}
                  </button>
                )}
                
                {order.status === 'preparing' && (
                  <button className="w-full py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600">
                    {dict.orders.actions.markReady}
                  </button>
                )}
                
                {order.status === 'ready' && (
                  <button className="w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
                    {dict.orders.actions.complete}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 