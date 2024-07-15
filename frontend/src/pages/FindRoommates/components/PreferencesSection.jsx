import { useState } from 'react';
import PreferencesDialog from './PreferencesDialog';
import PreferencesItem from './PreferencesItem';
import propTypes from 'prop-types';

function PreferencesSection({ preferences, refetch }) {
  const [openEdit, setOpenEdit] = useState(false);

  const onEdit = () => {
    setOpenEdit(!openEdit);
  };

  return (
    <div>
      <h4 className="text-lg mb-2">Preferences</h4>
      <ul className="flex flex-col gap-1">
        <PreferencesItem
          label="City"
          value={preferences?.city}
          onEdit={onEdit}
        />
        <PreferencesItem
          label="School"
          value={preferences?.school}
          onEdit={onEdit}
        />
        <PreferencesItem
          label="Budget"
          value={preferences?.budget.toString() + 'DH'}
          onEdit={onEdit}
        />
      </ul>
      {preferences ? (
        <PreferencesDialog
          open={openEdit}
          handler={onEdit}
          refetch={refetch}
          initialData={preferences}
        />
      ) : (
        ''
      )}
    </div>
  );
}

PreferencesSection.propTypes = {
  preferences: propTypes.object,
  refetch: propTypes.func,
};

export default PreferencesSection;
