import PropTypes from 'prop-types';
import { AiOutlineUser } from "react-icons/ai";

function AnonymousResidentCard({ student }) {
  return (
    <div className="flex gap-2 py-2 px-1">
      <div className="rounded-full flex items-center justify-center h-12 w-12 bg-black">
        <AiOutlineUser className='text-4xl mb-[2px] text-white'/>
      </div>
      <p>{student.userId.username}<br/>{student.school}</p>
      <p></p>
    </div>
  );
}

AnonymousResidentCard.propTypes = {
  student: PropTypes.object,
};

export default AnonymousResidentCard;
