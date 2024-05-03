import { ContainerOptionType } from '@/@types/type';
import ContentContainer from '@/components/Common/ContentContainer';
import TodayQuestion from '@/components/Common/TodayQuestion';
import FeedList from '@/components/Feed/FeedList';
import PostList from '@/components/Post/PostList';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Toast from '@/components/Common/Toast';
import { CheckIcon } from '@/components/Common/IconCollection';
import styles from '@/styles/Home.module.scss';
import classNames from 'classnames/bind';
import { getFeedList } from '@/components/Feed/FeedList/api';

export const getServerSideProps = async () => {
  const feedData = await getFeedList();
  return {
    props: {
      feedData: feedData.data,
    },
  };
};

export default function Home({ feedData }) {
  const cn = classNames.bind(styles);
  const [selectedOption, setSelectedOption] =
    useState<ContainerOptionType>('feed');
  const [selectedSort, setSelectedSort] = useState<
    'all' | 'followed' | 'myGeneration'
  >('all');
  const [toastVisible, setToastVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem('generation')) {
      setToastVisible(true);
      setTimeout(() => {
        setToastVisible(false);
        localStorage.removeItem('generation');
      }, 5000);
    }
  }, []);

  return (
    <div className={cn('home-container')}>
      <TodayQuestion />
      <ContentContainer
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
        selectedSort={selectedSort}
        setSelectedSort={setSelectedSort}
      >
        {selectedOption === 'feed' ? (
          <FeedList feedList={feedData} />
        ) : (
          <PostList selectedSort={selectedSort} />
        )}
      </ContentContainer>
      {toastVisible && (
        <Toast
          text="인증 신청이 완료되었습니다"
          icon={CheckIcon}
          fill="#0ACF83"
        />
      )}
    </div>
  );
}
