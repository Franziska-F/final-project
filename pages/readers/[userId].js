import 'material-react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'material-react-toastify';
import { useEffect, useState } from 'react';
import {
  getContactsByUserId,
  getFriendsById,
  getFriendsWithUsername,
  getUserById,
  getUserBySessionToken,
} from '../../util/database';

export default function Readers(props) {
  const [readerReviews, setReaderReviews] = useState([]);

  // Notification when request is made

  const requestMade = () => {
    toast.dark('Request made!', {
      position: toast.POSITION.TOP_LEFT,
      autoClose: 4000,
    });
  };

  // Notification when request already made

  const alreadyRequested = () => {
    toast.dark('You have already made a request!', {
      position: toast.POSITION.TOP_LEFT,
      autoClose: 4000,
    });
  };

  useEffect(() => {
    // GET reviews
    async function getReviewsByUserId() {
      const response = await fetch(`/api/reviews?userid=${props.reader.id}`);
      const reviews = await response.json();
      setReaderReviews(reviews);
    }
    getReviewsByUserId().catch(() => {
      console.log('Reviews request fails');
    });
  }, [props.reader.id]);

  async function makeRequest() {
    const response = await fetch(`../api/requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        connected_user_id: props.reader.id,
      }),
    });
    const request = await response.json();

    if (response.status === 400) {
      alreadyRequested();
    } else {
      requestMade();
    }
  }

  return (
    <>
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-8 px-10 ">
          <div className="self-center">
            <h3 className="text-center text-2xl mt-10 md:mt-0">
              wellcome to {props.reader.username}'s reading room
            </h3>
          </div>
          <div className="max-w-2xl max-h-2xl">
            <img
              src="../img/reading_room.jpeg"
              alt="drawing of a cosy room with a chair, a window, a small table and a bookshelf"
              className="w-full"
            />
          </div>
        </div>
      </section>

      <section className="my-20">
        <h2 className="text-center text-2xl">
          {props.reader.username}'s reviews
        </h2>
        {/* } Reviews {*/}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-8 px-20 mt-14">
          {readerReviews.map((listItem) => {
            return (
              <div
                className="text-center flex justify-center flex-col items-center"
                key={listItem.id}
              >
                <div>
                  <h3 className="text-center my-4">{listItem.book_title}</h3>
                  <div>
                    <label htmlFor="review">
                      <textarea
                        className="border border-black h-4/5 w-full mx-4 my-2 text-center"
                        id="review"
                        name="review"
                        value={listItem.review}
                      />
                    </label>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      {/* } Friends {*/}
      <section className="py-12">
        {props.isFriend.length ? (
          <>
            <h3 className="text-center text-2xl mb-14">
              {props.reader.username} is your friend
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-8 px-20 ">
              <div className="text-center">
                <h2 className="my-1">contact</h2>
                <h4>
                  {props.contacts.city}, {props.contacts.country}
                </h4>
                <h4>{props.contacts.email}</h4>
              </div>
              <div className="text-center">
                <h2 className="my-1"> {props.reader.username}'friends</h2>
                {props.friends.map((item) => {
                  return <h4 key={item.id}>{item.username}</h4>;
                })}
              </div>
            </div>
          </>
        ) : (
          <>
            <h3 className="text-center text-2xl mb-10 md:mb-16">
              connect with {props.reader.username}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-8 px-10 ">
              <div className="place-self-center">
                <button
                  className="bg-black w-full text-sm p-2 text-white rounded"
                  onClick={() =>
                    makeRequest().catch(() => {
                      console.log('Post request fails');
                    })
                  }
                >
                  {' '}
                  Send {props.reader.username} a friendship request
                </button>
                <ToastContainer />
              </div>
              <div>
                <p>
                  connect with other readers to see their friends, their email
                  address and location
                </p>
              </div>
            </div>
          </>
        )}
      </section>
    </>
  );
}

export async function getServerSideProps(context) {
  const reader = await getUserById(context.query.userId);

  const user = await getUserBySessionToken(context.req.cookies.sessionToken);

  const isFriend = await getFriendsById(context.query.userId, user.id);

  console.log(isFriend);

  const friends = await getFriendsWithUsername(context.query.userId);

  const contacts = await getContactsByUserId(context.query.userId);

  if (user) {
    // if user?!
    return {
      props: {
        reader: reader,
        isFriend: isFriend,
        friends: friends,
        contacts: contacts,
      },
    };
  }
  return {
    redirect: {
      destination: `/login?returnTo=/users/userProfile`,
      permanent: false,
    },
  };
}
