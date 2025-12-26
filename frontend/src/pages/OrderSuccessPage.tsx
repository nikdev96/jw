import { useLocation, useNavigate } from 'react-router-dom';

export const OrderSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state?.orderId;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-green-50/40 via-white to-white">
      <div className="text-center">
        <div className="text-5xl mb-4">✅</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Placed!</h1>
        {orderId && (
          <p className="text-gray-600 mb-6">Order #{orderId}</p>
        )}
        <p className="text-gray-600 mb-8 max-w-sm">
          Thank you for your order. We'll send you a confirmation soon.
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold shadow-lg shadow-green-600/20"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};
