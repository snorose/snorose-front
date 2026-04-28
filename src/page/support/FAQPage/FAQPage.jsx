import { useState } from 'react';

import { BackAppBar } from '@/shared/component';
import { renderTextWithLinks } from '@/shared/lib/hyperlink';

import { Accordion } from '@/feature/home/component';
import { faqList } from '@/feature/support/constant/faqList';

import style from './FAQPage.module.css';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className={style.container}>
      <BackAppBar title='자주 묻는 질문' notFixed />

      <div className={style.noticeContainer}>
        {`자주 묻는 질문을 확인해 보세요.\n궁금하신 점이 해결되지 않았다면, 아래 공식 창구로 문의해 주세요.`}
        <div>
          <p>[공식 문의 창구]</p>
          <p>- 이메일: snorose1906@gmail.com</p>
          <p>
            - 카카오톡: 1:1 문의 (
            <a
              className={style.link}
              href='http://pf.kakao.com/_Xmhxhn'
              target='_blank'
              rel='noreferrer noopener'
            >
              <span className={style.linkText}>링크</span>
            </a>
            )
          </p>
          <p>
            - 스노로즈 안내서 (
            <a
              className={style.link}
              href='https://www.notion.so/snorose/1957ef0aa3bf80a68ce3fe67f7a7e230'
              target='_blank'
              rel='noreferrer noopener'
            >
              <span className={style.linkText}>링크</span>
            </a>
            )
          </p>
        </div>
      </div>

      <div className={style.notice}>
        {faqList.map((faq, index) => (
          <Accordion
            key={index}
            title={faq.question}
            isOpen={openIndex === index}
            onClick={() => toggle(index)}
          >
            <div className={style.noticeBody}>
              {faq.content.map(({ title, list, listStyle }, contentIndex) => (
                <div key={contentIndex}>
                  {title && (
                    <h3 className={style.title}>
                      {renderTextWithLinks(title)}
                    </h3>
                  )}
                  {list && (
                    <ul
                      className={
                        listStyle === 'none' ? style.listStyleNone : undefined
                      }
                    >
                      {list.map((item, itemIndex) => (
                        <li key={itemIndex}>{renderTextWithLinks(item)}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </Accordion>
        ))}
      </div>
    </div>
  );
}
