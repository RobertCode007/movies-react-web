import React from 'react';
import Skeleton from '../Skeleton';
import styles from './index.module.scss';

const MovieInfoPageSkeleton: React.FC = () => {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* 返回按钮骨架 */}
        <div className={styles.back_button_skeleton}>
          <Skeleton width="100px" height="40px" borderRadius="8px" />
        </div>

        {/* 主要内容 */}
        <div className={styles.content}>
          {/* 左侧：海报骨架 */}
          <div className={styles.poster_section}>
            <div className={styles.poster_wrapper}>
              <Skeleton 
                width="100%" 
                height="450px" 
                borderRadius="12px"
              />
            </div>
          </div>

          {/* 右侧：详细信息骨架 */}
          <div className={styles.info_section}>
            {/* 标题和评分 */}
            <div className={styles.header}>
              <Skeleton width="80%" height="48px" borderRadius="8px" className={styles.title_skeleton} />
              <Skeleton width="60%" height="24px" borderRadius="6px" className={styles.original_title_skeleton} />
              <Skeleton width="50%" height="20px" borderRadius="6px" className={styles.tagline_skeleton} />
            </div>

            {/* 评分和基本信息 */}
            <div className={styles.meta}>
              <Skeleton width="150px" height="40px" borderRadius="8px" />
            </div>

            {/* 类型标签骨架 */}
            <div className={styles.genres}>
              <Skeleton width="80px" height="32px" borderRadius="20px" />
              <Skeleton width="100px" height="32px" borderRadius="20px" />
              <Skeleton width="90px" height="32px" borderRadius="20px" />
            </div>

            {/* 简介骨架 */}
            <div className={styles.overview_section}>
              <Skeleton width="120px" height="28px" borderRadius="6px" className={styles.section_title_skeleton} />
              <Skeleton width="100%" height="16px" borderRadius="4px" className={styles.overview_line} />
              <Skeleton width="100%" height="16px" borderRadius="4px" className={styles.overview_line} />
              <Skeleton width="100%" height="16px" borderRadius="4px" className={styles.overview_line} />
              <Skeleton width="80%" height="16px" borderRadius="4px" className={styles.overview_line} />
            </div>

            {/* 详细信息骨架 */}
            <div className={styles.details_grid}>
              <div className={styles.detail_item}>
                <Skeleton width="100px" height="14px" borderRadius="4px" />
                <Skeleton width="150px" height="18px" borderRadius="4px" className={styles.detail_value_skeleton} />
              </div>
              <div className={styles.detail_item}>
                <Skeleton width="80px" height="14px" borderRadius="4px" />
                <Skeleton width="100px" height="18px" borderRadius="4px" className={styles.detail_value_skeleton} />
              </div>
              <div className={styles.detail_item}>
                <Skeleton width="70px" height="14px" borderRadius="4px" />
                <Skeleton width="120px" height="18px" borderRadius="4px" className={styles.detail_value_skeleton} />
              </div>
              <div className={styles.detail_item}>
                <Skeleton width="120px" height="14px" borderRadius="4px" />
                <Skeleton width="60px" height="18px" borderRadius="4px" className={styles.detail_value_skeleton} />
              </div>
              <div className={styles.detail_item}>
                <Skeleton width="70px" height="14px" borderRadius="4px" />
                <Skeleton width="140px" height="18px" borderRadius="4px" className={styles.detail_value_skeleton} />
              </div>
              <div className={styles.detail_item}>
                <Skeleton width="80px" height="14px" borderRadius="4px" />
                <Skeleton width="130px" height="18px" borderRadius="4px" className={styles.detail_value_skeleton} />
              </div>
            </div>

            {/* 制作信息骨架 - 并行展示 */}
            <div className={styles.production_info_grid}>
              {/* 制作公司骨架 */}
              <div className={styles.production_section}>
                <Skeleton width="180px" height="28px" borderRadius="6px" className={styles.section_title_skeleton} />
                <div className={styles.production_companies}>
                  <Skeleton width="100px" height="60px" borderRadius="8px" />
                  <Skeleton width="100px" height="60px" borderRadius="8px" />
                  <Skeleton width="100px" height="60px" borderRadius="8px" />
                </div>
              </div>

              {/* 制作国家骨架 */}
              <div className={styles.production_section}>
                <Skeleton width="160px" height="28px" borderRadius="6px" className={styles.section_title_skeleton} />
                <div className={styles.countries}>
                  <Skeleton width="80px" height="20px" borderRadius="4px" />
                  <Skeleton width="100px" height="20px" borderRadius="4px" />
                </div>
              </div>

              {/* 语言骨架 */}
              <div className={styles.production_section}>
                <Skeleton width="140px" height="28px" borderRadius="6px" className={styles.section_title_skeleton} />
                <div className={styles.languages}>
                  <Skeleton width="100px" height="20px" borderRadius="4px" />
                  <Skeleton width="90px" height="20px" borderRadius="4px" />
                </div>
              </div>
            </div>

            {/* 外部链接骨架 */}
            <div className={styles.external_links}>
              <Skeleton width="100px" height="40px" borderRadius="8px" />
              <Skeleton width="80px" height="40px" borderRadius="8px" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieInfoPageSkeleton;

