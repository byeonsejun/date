// @ts-nocheck
import React, { useEffect } from 'react';
import CloseIcon from './CloseIcon';
import Image from 'next/image';
import useUiStore from '@/stores/useUiStore';
import BaseSelect from './BaseSelect';

const ageRange = ['연령대를 선택해주세요.', 10, 20, 30, 40, 50, 60];

export default function SurveyModal({ onClose, closeNum }) {
  const { surveyStep, setSurveyStep, userInfo, setUserInfo } = useUiStore();

  const handleUserGender = (value) => {
    setSurveyStep(2);
    setUserInfo({
      userGender: value,
      userAge: 0,
    });
  };

  const handleUserAge = () => (value) => {
    setUserInfo({
      userGender: userInfo.userGender,
      userAge: value,
    });
    setSurveyStep(99);
  };

  return (
    <section className="fixed top-0 left-0 flex flex-col justify-center items-center w-full h-full z-50 bg-neutral-900/90">
      {surveyStep !== 2 && (
        <button
          className="fixed top-0 right-0 text-white p-2 md:p-8"
          onClick={() => onClose()}
          aria-label="close button"
        >
          <CloseIcon />
        </button>
      )}

      <div className="bg-black w-[90%] h-[85%] max-w-7xl md:w-[80%] md:h-3/5 relative">
        <div className="w-full h-full p-4 flex flex-col items-center ">
          {surveyStep < 10 ? (
            <h2 className="text-2xl text-[#ebebeb] mb-4">맞춤형 서비스를 위한 설문조사에 참여해주세요.</h2>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <h2 className="text-2xl text-[#ebebeb] mb-4">설문조사에 참여해주셔서 감사합니다. 🙂</h2>
              <p>
                <span className="text-[#ebebeb]">{closeNum}초</span> 뒤에 창이 닫힙니다.
              </p>
            </div>
          )}
          <div className="w-full flex flex-col gap-2 mb-4">
            {surveyStep === 1 && (
              <>
                <p className="text-[#ebebeb] pr-4 text-right">{`(${surveyStep}/2)`}</p>
                <h3 className="text-[#ebebeb] text-center mb-4">자신의 성별을 선택해주세요.</h3>
                <div className="flex items-center justify-center gap-4">
                  <div
                    className="w-[360px] h-[360px] relative cursor-pointer transition-all border-[#f986bd] hover:border-2"
                    onClick={() => handleUserGender('male')}
                  >
                    <Image className="" src="/assets/image/male.png" alt="male img" fill sizes="360px" priority />
                  </div>
                  <div
                    className="w-[360px] h-[360px] relative cursor-pointer transition-all border-[#f986bd] hover:border-2"
                    onClick={() => handleUserGender('female')}
                  >
                    <Image className="" src="/assets/image/female.png" alt="male img" fill sizes="360px" priority />
                  </div>
                </div>
              </>
            )}
            {surveyStep === 2 && (
              <>
                <p className="text-[#ebebeb] pr-4 text-right">{`(${surveyStep}/2)`}</p>
                <h3 className="text-[#ebebeb] text-center mb-4">자신의 연령대를 선택해주세요.</h3>
                <div className="w-full flex items-center justify-center">
                  <div className="flex items-center justify-center gap-4 w-[50%]">
                    <BaseSelect onChange={handleUserAge('age')} selected={userInfo.userAge}>
                      {ageRange.map((item) => {
                        return (
                          <option key={`age-key-${item}`} value={item}>
                            {item} {item !== '연령대를 선택해주세요.' && '대'} {item === 60 && '이상'}
                          </option>
                        );
                      })}
                    </BaseSelect>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <p className="w-full text-right px-8">제공하신 정보는 통계치로 수집되지 않습니다.</p>
      </div>
    </section>
  );
}
