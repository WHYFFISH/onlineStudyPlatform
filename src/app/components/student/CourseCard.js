const CourseCard = ({ course }) => {
    return (
        <div className="course-card">
            <h3>{course.name}</h3>
            <p>{course.teacher}</p>
            <button>Register</button>
        </div>
    );
};

export default CourseCard;
