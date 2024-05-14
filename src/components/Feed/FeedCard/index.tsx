import Image from 'next/image';
import classNames from 'classnames/bind';
import fetchData from '@/api/fetchData';
import { DeleteIcon, EditIcon } from '@/components/Common/IconCollection';
import {
  InfiniteData,
  QueryObserverResult,
  RefetchOptions,
  useMutation,
} from '@tanstack/react-query';
import { Dispatch, SetStateAction } from 'react';
import WriterProfile from '@/components/Common/WriterProfile';
import useSendEmojiRequest from '@/hooks/useSendEmojiRequest';
import getElapsedTime from '@/utils/getElaspedTime';
import EmojiBundle from '@/components/Common/EmojiBundle';
import { FeedDetailType, FeedListType } from '../types';
import styles from './FeedCard.module.scss';

interface FeedCardTypes {
  refetch?: (
    options?: RefetchOptions | undefined,
  ) => Promise<QueryObserverResult<InfiniteData<FeedListType, unknown>, Error>>;
  feedData: FeedDetailType;
  hasPadding: boolean;
  forDetails?: boolean;
  onClick?: () => void;
  editState?: boolean;
  toggleEditMode?: Dispatch<SetStateAction<boolean>>;
}

const cn = classNames.bind(styles);

/**
 * @param {FeedData} feedData - 서버사이드 렌더링, getServerSideProps에서 getFeedList 요청에서 받아온 데이터입니다.
 * @param {boolean} modalVisible - 상위 컴포넌트의 모달 출력 여부 상태 변수입니다.
 * @param {Dispatch<SetStateAction<boolean>>} toggleModal - 상위 컴포넌트의 모달 출력 상태를 설정하는 세터함수입니다.
 * @param {boolean} hasPadding - 피드 상세와 피드 리스트 패딩 값이 달라 만들었습니다.
 * @param {boolean} hasHover - 피드 상세와 피드 리스트에서의 호버 여부가 달라 만들어줬습니다.
 * @return {JSX.Element} FeedCard - 사용자 프로필, 사용자가 생성한 내용, 감정을 남길수 있는 컴포넌트 포함된 컴포넌트입니다.
 */

export default function FeedCard({
  refetch,
  feedData,
  hasPadding,
  forDetails,
  onClick,
  editState,
  toggleEditMode,
}: FeedCardTypes) {
  const {
    id: feedId,
    content,
    viewCount,
    commentCount,
    createdAt,
    imageUrls,
    isMine,
    emojis,
  } = feedData.feed;

  const deleteMutaion = useMutation({
    mutationFn: () =>
      fetchData({
        param: `/feed/${feedId}`,
        method: 'delete',
      }),
  });

  const { handleEmojiClick, isAddPending, isDeletePending } =
    useSendEmojiRequest({
      id: feedId as number,
      isPost: false,
    });

  // 1. 편집하기 이모지 클릭 -> 2. 편집모드 상태 변경 -> 3. textArea 나타남 -> 4. 글 수정 기능 / x 아이콘 클릭시,  ***** -> 5. 등록 버튼 클릭 -> 이미지 삭제 요청 보내기 + form Post 요청

  return (
    <div
      className={cn(
        'container',
        hasPadding && 'padding',
        forDetails || 'container-hover',
      )}
    >
      <div className={cn('wrapper')}>
        <div className={cn('user-content')} onClick={onClick}>
          <div className={cn('profile-content-wrapper')}>
            <div className={cn('profile-content-divide')}>
              <WriterProfile
                writer={feedData.writer}
                createdAt={getElapsedTime(createdAt)}
              />
              {forDetails && isMine && (
                <div className={cn('icon-wrapper')}>
                  <EditIcon
                    width="18"
                    height="18"
                    onClick={() => {
                      toggleEditMode && toggleEditMode(!editState);
                    }}
                  />
                  <DeleteIcon
                    width="18"
                    height="18"
                    onClick={() => {
                      deleteMutaion.mutate();
                    }}
                  />
                </div>
              )}
            </div>
            {forDetails && !!imageUrls?.length && (
              <div className={cn('detail-upload-image-wrapper')}>
                {imageUrls.map((url: string, index) => (
                  <div key={index} className={cn('detail-upload-image')}>
                    <Image
                      fill
                      style={{ objectFit: 'cover' }}
                      src={url}
                      alt="feedImage"
                    />
                  </div>
                ))}
              </div>
            )}
            <div className={cn('content')}>{content}</div>
          </div>
          {forDetails ||
            (!!imageUrls?.length && (
              <div className={cn('upload-image-wrapper')}>
                <div className={cn('upload-image')}>
                  <Image
                    sizes="(max-width: 768px) 100vw, 33vw"
                    fill
                    style={{ objectFit: 'cover' }}
                    src={`${imageUrls[0]}`}
                    alt="feedImage"
                  />
                </div>
                {imageUrls.length > 1 && (
                  <span className={cn('extra-stuff')}>
                    + {imageUrls.length - 1}
                  </span>
                )}
              </div>
            ))}
        </div>
        <EmojiBundle
          commentCount={commentCount}
          viewCount={viewCount}
          emojiList={emojis}
          handleEmojiClick={handleEmojiClick}
          isPending={isAddPending || isDeletePending}
        />
      </div>
    </div>
  );
}
