import { Button } from '@material-tailwind/react';
import propTypes from 'prop-types';

function ProfileImgInput({ file, setFile, containerClassName, label }) {
  return (
    <div className={containerClassName}>
      <p>{label}</p>  
      <div className="flex items-center mt-1">
        <div className="h-16 w-16 overflow-hidden rounded-full bg-blue-100">
          {file ? (
            <img
              src={URL.createObjectURL(file)}
              alt="profile picture"
              className="w-full h-full object-cover"
            />
          ) : (
            ''
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          id="profileImg-input"
          className="hidden"
          onChange={(e) => setFile(e.target.files[0] || file)}
        />
        <Button
          variant="outlined"
          color="blue"
          className="ml-3"
          size="sm"
          onClick={() => document.querySelector('#profileImg-input').click()}
        >
          Upload
        </Button>
        <span className="ml-2 text-sm text-gray-600">Max size 2MB</span>
      </div>
    </div>
  );
}

ProfileImgInput.propTypes = {
  file: propTypes.object,
  setFile: propTypes.func,
  containerClassName: propTypes.string,
  label: propTypes.string,
};

export default ProfileImgInput;
