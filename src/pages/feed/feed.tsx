import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { clearFeed, getFeed } from '../../services/slices/FeedSlice';
import { useDispatch, useSelector } from '../../services/store';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.feed);

  useEffect(() => {
    dispatch(getFeed());
    return () => {
      dispatch(clearFeed());
    };
  }, []);

  if (loading) {
    return <Preloader />;
  }
  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        dispatch(clearFeed());
        dispatch(getFeed());
      }}
    />
  );
};
