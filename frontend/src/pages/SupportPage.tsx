import { motion } from 'framer-motion';

/**
 * SupportPage - Info/Support UI Skeleton
 *
 * ⚠️ THIS IS UI-ONLY - NO BUSINESS LOGIC
 *
 * TODO: Later connect:
 * - Real Telegram bot contact
 * - Dynamic FAQ from API
 * - Working hours from config
 * - Real social links
 */

interface SupportCard {
  id: string;
  icon: string;
  title: string;
  description: string;
  action?: string;
}

const supportCards: SupportCard[] = [
  {
    id: 'manager',
    icon: '👤',
    title: 'Contact Manager',
    description: 'Get help from our support team',
    action: 'Open Chat',
  },
  {
    id: 'delivery',
    icon: '🚚',
    title: 'Delivery Info',
    description: 'Local delivery · 30–90 min',
  },
  {
    id: 'payment',
    icon: '💳',
    title: 'Payment Methods',
    description: 'Cash, Card, Crypto accepted',
  },
  {
    id: 'hours',
    icon: '🕐',
    title: 'Working Hours',
    description: 'Mon–Sun, 10:00 AM – 10:00 PM',
  },
];

const faqItems = [
  {
    question: 'How long does delivery take?',
    answer: 'Typically 30-90 minutes depending on your location.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept cash, cards, and cryptocurrency.',
  },
  {
    question: 'Do you deliver to my area?',
    answer: 'Contact our manager to check delivery availability.',
  },
];

export const SupportPage = () => {
  // TODO: Replace with real Telegram bot link
  const handleContactManager = () => {
    console.log('TODO: Open Telegram chat with manager');
    // window.open('https://t.me/your_bot', '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg pb-20 transition-colors">
      {/* Header */}
      <div className="bg-white dark:bg-dark-surface border-b border-gray-200 dark:border-dark-border sticky top-0 z-10 transition-colors">
        <div className="max-w-[420px] mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 transition-colors">Support</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 transition-colors">We're here to help</p>
        </div>
      </div>

      <div className="max-w-[420px] mx-auto px-4 py-6">
        {/* Support Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {supportCards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={card.id === 'manager' ? handleContactManager : undefined}
              className={`bg-white dark:bg-dark-card rounded-2xl p-4 border border-gray-100 dark:border-dark-border ${
                card.action ? 'active:scale-95 cursor-pointer' : ''
              } transition-all`}
            >
              <div className="text-3xl mb-2">{card.icon}</div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-1 transition-colors">
                {card.title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-2 transition-colors">
                {card.description}
              </p>
              {card.action && (
                <div className="text-xs text-accent font-medium transition-colors">
                  {card.action} →
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border overflow-hidden mb-6 transition-colors">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-dark-border transition-colors">
            <h2 className="font-bold text-gray-900 dark:text-gray-100 text-base transition-colors">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-dark-border">
            {faqItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                className="px-4 py-4"
              >
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-2 transition-colors">
                  {item.question}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed transition-colors">
                  {item.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-accent-soft to-accent-soft/50 rounded-2xl p-6 text-center border border-accent/20 transition-colors"
        >
          <div className="text-4xl mb-3">💬</div>
          <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2 transition-colors">Still have questions?</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 transition-colors">
            Our support team is ready to help you
          </p>
          <button
            onClick={handleContactManager}
            className="bg-accent text-dark-bg px-6 py-3 rounded-xl font-semibold shadow-lg shadow-accent/30 active:scale-95 transition-all"
          >
            Contact Manager
          </button>
        </motion.div>

        {/* Footer Info */}
        <div className="text-center mt-6 text-xs text-gray-400 dark:text-gray-500 transition-colors">
          <p>🌿 JUSTWEED</p>
          <p className="mt-1">Premium Cannabis Store</p>
        </div>
      </div>

      {/*
        TODO: When connecting logic:
        - Add real Telegram bot link
        - Fetch FAQ from API
        - Add order history link
        - Add terms & privacy links
      */}
    </div>
  );
};
