import { useDispatch, useSelector } from 'react-redux';
import { findUserByIdThunk, logoutThunk, updateProfileThunk } from './users-thunk';
import { useNavigate } from 'react-router';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useEffect, useState } from 'react';
import { Alert, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { findReviewsByHostThunk } from '../reviews/reviews-thunks';
import { findFollowersThunk, findFollowingThunk } from '../follows/follows-thunks';
import { userLikesSongsThunk } from '../likes/likes-thunks';
import { parseTime } from '../events/parseTime';
import Follows from '../follows/follows';
import { getEventsByUserIdThunk } from '../events/event-thunks';

const Profile = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.users);
  const [firstName, setFirstName] = useState(currentUser.firstName);
  const [lastName, setLastName] = useState(currentUser.lastName);
  const [email, setEmail] = useState(currentUser.email);
  const [password, setPassword] = useState(currentUser.password);

  const [bio, setBio] = useState(currentUser.bio);
  const [website, setWebsite] = useState(currentUser.website);
  const [profilePic, setProfilePic] = useState(currentUser.profilePic);

  const [editProfile, setEditProfile] = useState(false);

  const [firstNameAlert, setFirstNameAlert] = useState(false);
  const [lastNameAlert, setLastNameAlert] = useState(false);
  const [passwordAlert, setPasswordAlert] = useState(false);

  const { reviews } = useSelector((state) => state.reviews);
  const { followers, following } = useSelector((state) => state.follows);
  const [followed, setFollowed] = useState(false);
  let { event } = useSelector((state) => state.event);

  event = event.filter((bg) => bg.host.hostName === currentUser.username);

  useEffect(() => {
    dispatch(findUserByIdThunk(currentUser._id));
    dispatch(getEventsByUserIdThunk(currentUser._id));
    dispatch(findReviewsByHostThunk(currentUser._id));
  }, []);
  const dispatch = useDispatch();
  const handleLogoutBtn = () => {
    dispatch(logoutThunk());
    dispatch(findUserByIdThunk(currentUser._id));
    dispatch(findReviewsByHostThunk(currentUser._id));
    dispatch(findFollowersThunk(currentUser._id));
    dispatch(findFollowingThunk(currentUser._id));
    navigate('/login');
  };
  const updateUserProfile = () => {
    setFirstNameAlert(false);
    setLastNameAlert(false);
    setPasswordAlert(false);

    if (firstName === '') {
      setFirstNameAlert(true);
    } else if (lastName === '') {
      setLastNameAlert(true);
    } else if (password === '') {
      setPasswordAlert(true);
    } else {
      const additionalFields = {};
      if (currentUser.role === 'MUSIC-CREATOR') {
        additionalFields.bio = bio;
        additionalFields.website = website;
        additionalFields.profilePic = profilePic;
      }

      dispatch(
        updateProfileThunk({
          ...currentUser,
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password,
          ...additionalFields,
        })
      );
      setEditProfile(false);
    }
  };

  return (
    <>
      <h2>Profile</h2>

      <Alert
        variant="danger"
        onClose={() => setFirstNameAlert(false)}
        className={firstNameAlert ? 'd-block' : 'd-none'}
        dismissible
      >
        <span>The field First Name is required!</span>
      </Alert>
      <Alert
        variant="danger"
        onClose={() => setLastNameAlert(false)}
        className={lastNameAlert ? 'd-block' : 'd-none'}
        dismissible
      >
        <span>The field last name is required!</span>
      </Alert>
      <Alert
        variant="danger"
        onClose={() => setPasswordAlert(false)}
        className={passwordAlert ? 'd-block' : 'd-none'}
        dismissible
      >
        <span>The field password is required!</span>
      </Alert>
      {currentUser && (
        <>
          {currentUser.role === 'MUSIC-CREATOR' ? (
            <img
              src={
                currentUser.profilePic
                  ? currentUser.profilePic
                  : 'https://robohash.org/1.png'
              }
              alt="profileImg"
              width="148px"
              height="148px"
              radius="48px"
            />
          ) : (
            ''
          )}

          <h5>
            <Badge bg={'secondary'}>
              {currentUser.role === 'MUSIC-CREATOR' ? 'EVENT-MANAGER' : currentUser.role}
            </Badge>
          </h5>

          <Form>
            <Form.Group as={Row} className="mb-3" controlId="profileFirstName">
              <Form.Label column sm="2" className={'text-secondary'}>
                First Name
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  readOnly={!editProfile}
                  plaintext={!editProfile}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3" controlId="profileLastName">
              <Form.Label column sm="2" className={'text-secondary'}>
                Last Name
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  readOnly={!editProfile}
                  plaintext={!editProfile}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3" controlId="profileUsername">
              <Form.Label column sm="2" className={'text-secondary'}>
                Username
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  value={currentUser.username}
                  readOnly={!editProfile}
                  plaintext={!editProfile}
                  disabled={editProfile}
                />
                {editProfile && (
                  <Form.Text>Username are not changeable</Form.Text>
                )}
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="profileEmail">
              <Form.Label column sm="2" className={'text-secondary'}>
                Email
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  readOnly={!editProfile}
                  plaintext={!editProfile}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3" controlId="profilePassword">
              <Form.Label column sm="2" className={'text-secondary'}>
                Password
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="password"
                  value={password}
                  as={'input'}
                  onChange={(event) => setPassword(event.target.value)}
                  readOnly={!editProfile}
                  plaintext={!editProfile}
                />
              </Col>
            </Form.Group>
            {currentUser && currentUser.role === 'MUSIC-CREATOR' ? (
              <div>
                <Form.Group as={Row} className="mb-3" controlId="profileBio">
                  <Form.Label column sm="2" className={'text-secondary'}>
                    Bio
                  </Form.Label>
                  <Col sm="10">
                    <Form.Control
                      type="textarea"
                      value={bio}
                      onChange={(event) => setBio(event.target.value)}
                      readOnly={!editProfile}
                      plaintext={!editProfile}
                    />
                  </Col>
                </Form.Group>

                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="profileWebsite"
                >
                  <Form.Label column sm="2" className={'text-secondary'}>
                    Website
                  </Form.Label>
                  <Col sm="10">
                    <Form.Control
                      type="text"
                      value={website}
                      onChange={(event) => setWebsite(event.target.value)}
                      readOnly={!editProfile}
                      plaintext={!editProfile}
                    />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="profilePic">
                  <Form.Label column sm="2" className={'text-secondary'}>
                    Profile Picture
                  </Form.Label>
                  <Col sm="10">
                    <Form.Control
                      type="text"
                      value={profilePic}
                      onChange={(event) => setProfilePic(event.target.value)}
                      readOnly={!editProfile}
                      plaintext={!editProfile}
                    />
                  </Col>
                </Form.Group>
              </div>
            ) : (
              ''
            )}

            {currentUser && currentUser.role === 'ADMIN' ? (
              <div>
                <Form.Group as={Row} className="mb-3" controlId="adminType">
                  <Form.Label column sm="2" className={'text-secondary'}>
                    Admin Type
                  </Form.Label>
                  <Col sm="10">
                    <Form.Control
                      type="text"
                      value={currentUser.type}
                      readOnly
                      plaintext
                    />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="adminFromDate">
                  <Form.Label column sm="2" className={'text-secondary'}>
                    Admin Since
                  </Form.Label>
                  <Col sm="10">
                    <Form.Control
                      type="text"
                      value={new Date(currentUser.adminFromDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        timeZone: "UTC",
                      })}
                      readOnly
                      plaintext
                    />
                  </Col>
                </Form.Group>
              </div>
            ) : (
              ''
            )}
          </Form>
        </>
      )}

      {!editProfile ? (
        <Button onClick={() => setEditProfile(true)}>Edit Profile</Button>
      ) : (
        <Button onClick={updateUserProfile}>Save</Button>
      )}

      <Button
        className={'ms-5'}
        onClick={() => navigate('/profile/' + currentUser._id)}
      >
        View Public Profile
      </Button>
      <br />
      <div className={' mt-3 mb-3'}>
        <hr />

        {currentUser && currentUser.role === 'MUSIC-CREATOR' && (
          <>
            <h2>Events</h2>
            <ul className={'list-group mb-3'}>
              {event && event.length === 0 ? (
                <p>This user haven't created any event.</p>
              ) : (
                event
                  .filter((bg) => bg.host.hostName === currentUser.username)
                  .map((e) => (
                    <li
                      className={'list-group-item'}
                      onClick={() => navigate('/event/details/' + e._id)}
                      key={e._id}
                    >
                      <h5>{e.title}</h5>

                      <i
                        onClick={() => {
                          dispatch(userLikesSongsThunk());
                        }}
                        className="red"
                      ></i>
                      <div className={'text-secondary'}>
                        <span>By: {e.host.hostName}</span>
                        <i className="bi bi-dot"></i>
                        <span>{new Date(e.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          timeZone: "UTC",
                        })}</span>
                      </div>
                    </li>
                  ))
              )}
            </ul>
          </>
        )}

        <Follows uid={currentUser._id} />

        <h2>Reviews</h2>
        <ul className={'list-group mb-3'}>
          {currentUser && reviews && reviews.length === 0 ? (
            <p>This user haven't posted any reviews yet.</p>
          ) : (
            reviews.map((u) => (
              <li
                className={'list-group-item'}
                onClick={() => navigate(`/song/details/${u.idSong}`)}
              >
                <span className={'fw-bold'}>
                  <Link
                    className={'text-black'}
                    to={`/profile/${u.host._id}`}
                  >
                    {u.host.username}
                  </Link>
                </span>
                <span>
                  <i className="bi bi-dot"></i>
                  {parseTime(u.time)}
                </span>
                <p>{u.review}</p>
              </li>
            ))
          )}
        </ul>
      </div>
      <hr />

      <Button className={'btn-danger mt-3'} onClick={handleLogoutBtn}>
        Logout
      </Button>
    </>
  );
};
export default Profile;