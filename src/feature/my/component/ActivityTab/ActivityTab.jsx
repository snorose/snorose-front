import { Link } from 'react-router-dom';

import { Icon } from '@/shared/component';

import styles from './ActivityTab.module.css';

const ActivityTab = () => {
  return (
    <>
      <div className={styles.infoWrapper}>
        {[
          {
            label: '내 글 모아보기',
            link: 'my-post',
          },
          {
            label: '댓글 단 글 모아보기',
            link: 'comment',
          },
          {
            label: '다운 받은 시험 후기 모아보기',
            link: 'download-exam-review',
          },
          {
            label: '내 문의 및 신고 모아보기',
            link: 'inquiry-report',
          },
          {
            label: '스크랩한 시험 후기 모아보기',
            link: 'scrap-exam-review',
          },
          {
            label: '스크랩한 글 모아보기',
            link: 'scrap',
          },
        ].map((item, index) => (
          <div className={styles.itemList} key={index}>
            <Link to={item.link}>
              <div className={styles.item}>
                <span>{item.label}</span>
                <Icon
                  id='angle-right'
                  width={16}
                  height={16}
                  fill='#898989'
                  stroke='#898989'
                />
              </div>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
};

export default ActivityTab;
