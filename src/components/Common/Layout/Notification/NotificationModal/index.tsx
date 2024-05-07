import styles from './NotificationModal.module.scss';
import classNames from 'classnames/bind';
import Modal from '@/components/Common/Layout/Modal';
import ToggleButton from '@/components/Common/Buttons/ToggleButton';
import DefaultButton from '@/components/Common/Buttons/DefaultButton';
import { useQuery } from '@tanstack/react-query';
import fetchData from '@/api/fetchData';
import { NotificationSettingType } from '../type';
import LoadingSpinner from '@/components/Common/LoadingSpinner';

interface NotificationModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const cn = classNames.bind(styles);

export default function NotificationModal({
  isOpen,
  setIsOpen,
}: NotificationModalProps) {
  const handleButtonClick = () => {
    console.log('알림 설정 완료 클릭');
  };

  const { data: notificationSetting, isLoading } =
    useQuery<NotificationSettingType>({
      queryKey: ['notificationSetting'],
      queryFn: () =>
        fetchData({
          param: `/notification/setting/mine`,
        }),
    });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const { isCommentNotification, isEmojiNotification, isFollowNotification } =
    notificationSetting as NotificationSettingType;

  return (
    <Modal
      title="알림 설정"
      modalVisible={isOpen}
      toggleModal={setIsOpen}
      cssComponentDisplay={cn('')}
      cssModalSize={cn('notification')}
      className={cn('notification-modal')}
    >
      <div className={cn('notification-modal-wrapper')}>
        <div className={cn('notification-modal-container')}>
          <div className={cn('notification-modal-item')}>
            <h3>댓글</h3>
            <ToggleButton setting={isCommentNotification} />
          </div>
          <div className={cn('notification-modal-item')}>
            <h3>이모지</h3>
            <ToggleButton setting={isEmojiNotification} />
          </div>
          <div className={cn('notification-modal-item')}>
            <h3>팔로우</h3>
            <ToggleButton setting={isFollowNotification} />
          </div>
        </div>
        <DefaultButton
          onClick={handleButtonClick}
          size="large"
          color="primary-01"
        >
          등록하기
        </DefaultButton>
      </div>
    </Modal>
  );
}
