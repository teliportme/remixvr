import { useContext } from 'react';
import { RouterContext } from './CustomBrowserRouter';

export default function useRouter() {
  return useContext(RouterContext);
}
