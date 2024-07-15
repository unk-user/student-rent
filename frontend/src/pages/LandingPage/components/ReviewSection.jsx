import FakeReview from './FakeReview';
import defaultProfile from '@/assets/blank-profile-picture-973460.svg';

function ReviewSection() {
  return (
    <div className="grid grid-cols-4 gap-4 w-full max-w-[1432px] max-xl:px-4 max-xl:grid-cols-2 max-xl:gap-2 max-sm:grid-cols-1 mx-auto pb-24 pt-12">
      <FakeReview
        user="John Doe"
        rating={5}
        role="student"
        profileSrc={defaultProfile}
      >
        As a student, I found it challenging to find affordable rent. Uroom
        revolutionized the process, I highly recommend it to anyone seeking an
        apartment as a student. It assisted me in finding my ideal space!
      </FakeReview>
      <FakeReview
        user="Salah Eddine"
        rating={4}
        role="student"
        profileSrc={defaultProfile}
      >
        I have been using Uroom for a long time and have found it to be an
        effective solution for finding a rental, it has a large community.
      </FakeReview>
      <FakeReview
        user="Alice Smith"
        rating={5}
        role="student"
        profileSrc={defaultProfile}
      >
        The project has been a game-changer for me. It provided me with a
        seamless experience and exceeded all my expectations. I highly recommend
        it to anyone looking for a reliable solution.
      </FakeReview>
      <FakeReview
        user="Bob Johnson"
        rating={5}
        role="student"
        profileSrc={defaultProfile}
      >
        I have been using Uroom for the last 2 years and it has been a
        consistent source of finding my ideal rental space.
      </FakeReview>
    </div>
  );
}

export default ReviewSection;
