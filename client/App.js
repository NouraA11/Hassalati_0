import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './contexts/auth.js';
import ScreensNav from './components/nav/ScreensNav.js';
import { CategoryProvider } from './contexts/category.js';
import { TransactionProvider } from './contexts/transaction.js';

export default function App() {
  return (
      <NavigationContainer>
        <AuthProvider>
          <CategoryProvider>
            <TransactionProvider>
              <ScreensNav />
            </TransactionProvider>
          </CategoryProvider>
        </AuthProvider>
      </NavigationContainer>
  );
}
