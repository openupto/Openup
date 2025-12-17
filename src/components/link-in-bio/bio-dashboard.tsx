import { useState } from 'react';
import { BioPagesList } from './bio-pages-list';
import { BioPageEditor } from './bio-page-editor';
import { LinkBioPage } from '../../utils/supabase/api';

export function BioDashboard() {
  const [view, setView] = useState<'list' | 'editor'>('list');
  const [selectedPage, setSelectedPage] = useState<LinkBioPage | null>(null);

  const handleEditPage = (page: LinkBioPage) => {
    setSelectedPage(page);
    setView('editor');
  };

  const handleBack = () => {
    setSelectedPage(null);
    setView('list');
  };

  if (view === 'editor' && selectedPage) {
    return <BioPageEditor initialPage={selectedPage} onBack={handleBack} />;
  }

  return <BioPagesList onEditPage={handleEditPage} />;
}
