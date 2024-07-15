import { IconButton } from '@material-tailwind/react';
import { Edit01Icon } from 'hugeicons-react';
import PropTypes from 'prop-types';

function PreferencesItem({ value, label, onEdit }) {
  return (
    <li className="flex items-center justify-between">
      <div>
        <p className="text-base leading-4">{label}</p>
        <span className="text-sm text-gray-600">
          {value || 'not specified'}
        </span>
      </div>
      <IconButton onClick={onEdit} size="sm" variant="text">
        <Edit01Icon size={18} />
      </IconButton>
    </li>
  );
}

PreferencesItem.propTypes = {
  value: PropTypes.string,
  label: PropTypes.string,
  onEdit: PropTypes.func,
};

export default PreferencesItem;
