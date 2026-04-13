import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  return (
    <nav aria-label="Breadcrumb" className="flex mb-6">
      <ol className="flex items-center space-x-2 text-[10px] md:text-xs font-medium uppercase tracking-[0.1em] text-brand-dark/40">
        <li className="flex items-center">
          <Link to="/" className="hover:text-brand-green transition-colors flex items-center gap-1">
            <Home size={12} />
            <span className="hidden md:inline">Главная</span>
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            <ChevronRight size={12} className="mx-1 text-brand-dark/20" />
            {item.to ? (
              <Link to={item.to} className="hover:text-brand-green transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-brand-dark/60 font-bold">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
