package com.e101.nift.secondhand.service;

import com.e101.nift.common.util.ConvertUtil;
import com.e101.nift.gifticon.entity.Gifticon;
import com.e101.nift.gifticon.repository.GifticonRepository;
import com.e101.nift.secondhand.entity.Article;
import com.e101.nift.secondhand.exception.ArticleErrorCode;
import com.e101.nift.secondhand.exception.ArticleException;
import com.e101.nift.secondhand.model.contract.GifticonNFT;
import com.e101.nift.secondhand.model.dto.request.PostArticleDto;
import com.e101.nift.secondhand.model.dto.response.ArticleDetailDto;
import com.e101.nift.secondhand.model.dto.response.ArticleListDto;
import com.e101.nift.secondhand.model.state.SaleStatus;
import com.e101.nift.secondhand.repository.LikeRepository;
import com.e101.nift.secondhand.repository.ArticleRepository;
import com.e101.nift.user.entity.User;
import com.e101.nift.user.repository.UserRepository;
import com.e101.nift.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Slf4j
@Service
@RequiredArgsConstructor
public class ArticleServiceImpl implements ArticleService {

    private final ArticleRepository articleRepository;
    private final LikeRepository likeRepository;
    private final GifticonRepository gifticonRepository;
    private final UserRepository userRepository;
    private final TransactionService transactionService;
    private final UserService userService;

    @Override
    @Transactional(readOnly = true)
    public Page<ArticleListDto> getArticleList(String sort, List<Long> categories, Pageable pageable, Long userId, Integer minPrice, Integer maxPrice) {
        // 정렬 기준
        Sort sortBy = switch (sort) {
            case "highest" -> Sort.by(Sort.Direction.DESC, "currentPrice").and(Sort.by("articleId"));
            case "lowest" -> Sort.by(Sort.Direction.ASC, "currentPrice").and(Sort.by("articleId"));
            case "likes" -> Sort.by(Sort.Direction.DESC, "countLikes").and(Sort.by("articleId"));
            case "views" -> Sort.by(Sort.Direction.DESC, "viewCnt").and(Sort.by("articleId"));
            default -> Sort.by(Sort.Direction.DESC, "createdAt").and(Sort.by("articleId"));
        };

        // 판매 중인 상태만 조회 가능하게
        SaleStatus targetState = SaleStatus.ON_SALE;

        // 정렬이 적용된 Pageable 생성
        Pageable sortedPageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sortBy);

        Page<ArticleListDto> articles;

        // 필터
        if (categories != null && !categories.isEmpty()) {
            // 카테고리 필터가 적용된 경우
            if (minPrice != null || maxPrice != null) {
                // 카테고리 + 가격 조건 모두 적용
                articles = articleRepository.findByCategoryAndPriceRange(categories, minPrice, maxPrice, targetState, sortedPageable)
                        .map(article -> {
                            boolean isLiked = (userId != null) &&
                                    likeRepository.existsByArticle_ArticleIdAndUser_UserId(article.getArticleId(), userId);
                            return ArticleListDto.from(article, isLiked);
                        });
            } else {
                // 카테고리만 적용
                articles = articleRepository.findByCategoryIds(categories, targetState, sortedPageable)
                        .map(article -> {
                            boolean isLiked = (userId != null) &&
                                    likeRepository.existsByArticle_ArticleIdAndUser_UserId(article.getArticleId(), userId);
                            return ArticleListDto.from(article, isLiked);
                        });
            }
        } else {
            // 카테고리 필터가 없는 경우
            if (minPrice != null || maxPrice != null) {
                // 가격 조건만 적용
                articles = articleRepository.findByPriceRange(minPrice, maxPrice, targetState, sortedPageable)
                        .map(article -> {
                            boolean isLiked = (userId != null) &&
                                    likeRepository.existsByArticle_ArticleIdAndUser_UserId(article.getArticleId(), userId);
                            return ArticleListDto.from(article, isLiked);
                        });
            } else {
                // 아무 필터도 없는 경우 전체 조회
                articles = articleRepository.findAll(sortedPageable)
                        .map(article -> {
                            boolean isLiked = (userId != null) &&
                                    likeRepository.existsByArticle_ArticleIdAndUser_UserId(article.getArticleId(), userId);
                            return ArticleListDto.from(article, isLiked);
                        });
            }
        }
        return articles;
    }

    // 가격 필터링 최대 가격
    @Override
    @Transactional(readOnly = true)
    public Float getMaxCurrentPrice() {
        Float maxPrice = articleRepository.findMaxCurrentPrice();
        return maxPrice != null ? maxPrice : 0f;
    }

    // 로그인 여부와 관계없이 전체 상품 반환
    // userId == null 이면 isLiked=false로 설정
    private ArticleListDto mapArticleToDto(Article article, Long userId) {
        boolean isLiked = (userId != null) && likeRepository.existsByArticle_ArticleIdAndUser_UserId(article.getArticleId(), userId);
        log.info("상품 ID: {}, userId: {}, isLiked: {}", article.getArticleId(), userId, isLiked);

        return ArticleListDto.from(article, isLiked);
    }

    // 중고 기프티콘의 상세 정보 조회
    @Override
    public ArticleDetailDto getArticleDetail(Long articleId, Long userId) {

        Article article = articleRepository.findByArticleId(articleId)
                .orElseThrow(() -> new RuntimeException("상품이 조회되지 않습니다."));

        Gifticon gifticon = article.getGifticon();
        boolean isLiked = false;
        if (userId != null) {
            isLiked = likeRepository.existsByArticle_ArticleIdAndUser_UserId(articleId, userId);
        }

        User user = userRepository.findByUserId(article.getUserId())
                .orElseThrow(() -> new RuntimeException("판매자 정보가 조회되지 않습니다."));

        return new ArticleDetailDto(
                article.getArticleId(),
                article.getGifticon().getGifticonId(),
                article.getSerialNum(),
                article.getTitle(),
                article.getDescription(),
                article.getUserId(),
                article.getExpirationDate(),
                article.getImageUrl(),
                article.getCountLikes(),
                article.getCurrentPrice(),
                article.getCreatedAt(),
                article.getViewCnt(),
                gifticon.getPrice(),
                gifticon.getBrand().getBrandName(),
                gifticon.getCategory().getCategoryName(),
                isLiked,
                user.getNickName(),
                user.getProfileImage()
        );
    }

    @Override
    public void createArticle(PostArticleDto postArticleDto, Long loginUser) {
        GifticonNFT.ListedForSaleEventResponse listedForSaleEventResponse = transactionService.getListedForSaleEventByTxHash(postArticleDto.getTxHash()).getFirst();

        log.info("[ArticleService] listedForSaleEventResponse: {}", listedForSaleEventResponse);

        Gifticon gifticon = gifticonRepository.findById(listedForSaleEventResponse.tokenId.longValue())
                .orElseThrow(() -> new IllegalArgumentException("기프티콘이 존재하지 않습니다."));

        Long userId = userService.findUserIdByAddress(listedForSaleEventResponse.seller)
                .orElseThrow(() -> new ArticleException(ArticleErrorCode.CANNOT_FIND_BY_ADDRESS));

        if(!userId.equals(loginUser)) {
            log.info("[ContractService] 트랜잭션 유저 정보: {} {}", userId, loginUser);
            throw new ArticleException(ArticleErrorCode.USER_MISMATCH);
        }

        articleRepository.save(
                Article.builder()
                        .title(postArticleDto.getTitle())
                        .description(postArticleDto.getDescription())
                        .userId(userId)
                        .countLikes(0)
                        .createdAt(ConvertUtil.convertTimestampToLocalTime(listedForSaleEventResponse.transactionTime))
                        .viewCnt(0)
                        .imageUrl(ConvertUtil.convertIpfsUrl(listedForSaleEventResponse.metadataURI))
                        .gifticon(gifticon)
                        .serialNum(listedForSaleEventResponse.serialNumber.longValue())
                        .expirationDate(ConvertUtil.convertTimestampToLocalTime(listedForSaleEventResponse.expirationDate))
                        .currentPrice(listedForSaleEventResponse.price.floatValue())
                        .txHash(postArticleDto.getTxHash())
                        .state(SaleStatus.ON_SALE)
                        .build()
        );
    }

    @Override
    public void deleteArticle(Long id) {
        articleRepository.deleteById(id);
    }
}