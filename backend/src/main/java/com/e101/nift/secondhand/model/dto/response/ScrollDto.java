package com.e101.nift.secondhand.model.dto.response;

import io.swagger.v3.oas.annotations.Operation;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ScrollDto<T> {
    // 마이페이지의 거래내역에서 스크롤로
    // 다음 내역 조회할 수 있게하기 위해 추가했습니다

    // 구매내역, 판매내역, 보낸선물 내역 모두에서 사용할 수 있게
    // 제네릭 타입 설정했습니다.

    private List<T> histories;
    private boolean hasNext;
}
