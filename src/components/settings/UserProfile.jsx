import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import StarHalfOutlinedIcon from "@mui/icons-material/StarHalfOutlined";
import StarOutlinedIcon from "@mui/icons-material/StarOutlined";
import moment from "moment/moment";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffectOnce, useInfiniteScroll } from "../../CustomHooks/hooks";
import { HTMLNodes } from "../../utils/elements";
import { callRequest } from "../../utils/requests";
import { strings } from "../../utils/strings";
import { Modal } from "../base/Modal";
import { Photo } from "../base/Photo";
import { RateStars } from "../base/RateStars";
import { XText } from "../base/Texts";
import BaseLayout from "./../BaseLayout";

const UserProfile = ({}) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [profile, setProfile] = React.useState();
    const [page, setPage] = React.useState(1);
    const [lastPage, setLastPage] = React.useState(0);
    const [totalPages, setTotalPages] = React.useState(1);

    const [homestays, setHomestays] = React.useState([]);

    useEffectOnce(() => {
        var myHeaders = new Headers();

        var requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
        };

        callRequest(`user/profile/${id}`, requestOptions)
            .then((response) => {
                setProfile(response.data);
            })
            .catch((response) => {
                if (response.status === 404) {
                    navigate("/not-found");
                    return;
                }
                if (response.status === 403) {
                    navigate("/forbidden");
                    return;
                }
                alert(response.message);
                navigate("/");
            });
    });

    function searchAccommodations() {
        if (lastPage >= page) {
            return;
        }

        var requestOptions = {
            method: "GET",
            redirect: "follow",
        };
        callRequest(
            `accommodation/house-owner/accommodations?userId=${id}&size=9&page=${page}&orderBy=createdAt&isDescending=true`,
            requestOptions
        )
            .then((response) => {
                setHomestays([...homestays, ...response.data.items]);
                setTotalPages(response.data.totalPages);
                setLastPage(response.data.page);
            })
            .catch((response) => console.log(response));
    }

    useEffectOnce(() => {
        searchAccommodations();
    });

    const [, lastElementRef] = useInfiniteScroll({
        page,
        setPage,
        totalPages,
        action: searchAccommodations,
    });

    return (
        <BaseLayout>
            <div className='w-full px-4 sm:w-3/4 mt-12 m-auto mb-24'>
                {profile && (
                    <div className='flex gap-12 flex-col lg:flex-row'>
                        <div className=''>
                            <div className='border border-gray-200 rounded-md w-full sm:w-96 p-4 flex flex-col items-center justify-center'>
                                <Photo
                                    src={profile.avatar}
                                    errorSrc={
                                        "https://media.licdn.com/dms/image/D5603AQFjj8ax4V-xAA/profile-displayphoto-shrink_800_800/0/1630492357650?e=2147483647&v=beta&t=YjkYny8bntrJCfZC9myByVcPUdSEt-7kM8e31ajsByo"
                                    }
                                    className='w-32 h-32 rounded-full object-cover'
                                    alt={`ảnh đại diện ${profile.username}`}
                                />
                                <h3 className='font-bold mt-2'>{profile.username}</h3>
                                {profile.host && <h3 className=''>Chủ nhà</h3>}
                            </div>
                            {profile.host && (
                                <div className='border border-gray-200 rounded-md w-full sm:w-96 p-4 flex flex-col mt-4 gap-2'>
                                    <div className='flex gap-2 items-center'>
                                        <StarOutlinedIcon className='text-gray-500' />
                                        {profile.rating ? (
                                            <h4 className=''>
                                                <span className='text-xl font-bold'>
                                                    {profile.rating}
                                                </span>{" "}
                                                <span className='text-md'>
                                                    {" "}
                                                    sao đánh giá
                                                </span>
                                            </h4>
                                        ) : (
                                            <h4 className=''>
                                                <span className=''>Chưa có đánh giá</span>
                                            </h4>
                                        )}
                                    </div>
                                    <div className='flex gap-2 items-center'>
                                        <RateReviewOutlinedIcon className='text-gray-500' />
                                        {profile.reviews ? (
                                            <h4 className=''>
                                                <span className='text-xl font-bold'>
                                                    {profile.reviews}
                                                </span>{" "}
                                                <span className='text-md'>
                                                    {" "}
                                                    bình luận
                                                </span>
                                            </h4>
                                        ) : (
                                            <h4 className=''>
                                                <span className=''>
                                                    Chưa có bình luận
                                                </span>
                                            </h4>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className='lg:p-4 w-full'>
                            <h2 className='text-2xl font-bold'>
                                Thông tin về {profile.username}
                            </h2>
                            <div className='flex gap-2 mt-8'>
                                <HowToRegOutlinedIcon className='text-gray-500' />
                                <h4 className=''>
                                    Tham gia vào{" "}
                                    {moment(profile.joinedAt, "HH:mm DD/MM/YYYY").format(
                                        "DD MMM YYYY"
                                    )}
                                </h4>
                            </div>
                            <div className='flex gap-2 mt-4'>
                                <LocationOnOutlinedIcon className='text-gray-500' />
                                {profile.address ? (
                                    <h4 className=''>Live in {profile.address}</h4>
                                ) : (
                                    <h4 className=''>Chưa cung cấp địa chỉ</h4>
                                )}
                            </div>
                            {profile.bio ? (
                                <HTMLNodes rawHTML={profile.bio} className='mt-8' />
                            ) : (
                                <h4 className='mt-8'>Chưa cung cấp mô tả</h4>
                            )}
                            <ReviewsSection profile={profile} userId={id} />
                            {homestays.length > 0 && (
                                <div className='mt-8 border-t border-gray-200 pt-8 w-full'>
                                    <h4 className='text-xl font-bold mb-4'>
                                        Danh sách nhà
                                    </h4>
                                    <div className='gap-4 items-center w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-1 2xl:grid-cols-2 min-[1920px]:grid-cols-3'>
                                        {homestays.map((homestay, index) => (
                                            <Homestay homestay={homestay} key={index} />
                                        ))}
                                        <div className='' ref={lastElementRef}></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </BaseLayout>
    );
};
export default UserProfile;

function ReviewsSection({ profile, userId }) {
    const [previewReviews, setPreviewReviews] = React.useState([]);
    const [previewIndexes, setPreviewIndexes] = React.useState([]);
    const [showMoreReviewsModal, setShowMoreReviewsModal] = React.useState(false);
    const [reviews, setReviews] = React.useState([]);
    const [totalPages, setTotalPages] = React.useState(1);
    const [totalItems, setTotalItems] = React.useState(1);
    const [page, setPage] = React.useState(1);

    const setIndexes = (fromIndex, previewReviews) => {
        if (previewReviews.length === 0) {
            setPreviewIndexes([]);
            return;
        }
        if (previewReviews.length === 1) {
            setPreviewIndexes([0]);
            return;
        }
        if (previewReviews.length === 2) {
            setPreviewIndexes([0, 1]);
            return;
        }
        setPreviewIndexes([
            (fromIndex + previewReviews.length) % previewReviews.length,
            (fromIndex + previewReviews.length + 1) % previewReviews.length,
        ]);
    };

    useEffectOnce(() => {
        var requestOptions = {
            method: "GET",
            redirect: "follow",
        };
        return callRequest(
            `accommodation/house-owner/reviews?userId=${userId}&size=9&page=${1}&orderBy=created_At&isDescending=true`,
            requestOptions
        )
            .then((response) => {
                const reviews = response.data.items;

                setReviews(reviews);
                setPreviewReviews(reviews);
                setIndexes(0, reviews);

                setTotalPages(response.data.totalPages);
                setTotalItems(response.data.totalItems);
            })
            .catch((response) => {
                console.log(response);
            });
    });

    return reviews.length === 0 ? null : (
        <div className='mt-8 border-t border-gray-200 pt-8'>
            <div className='flex items-center'>
                <h4 className='text-xl font-bold mb-2'>
                    Đánh giá về nhà của {profile.username}
                </h4>
                <div className='flex gap-2 items-center ml-auto'>
                    <button
                        disabled={previewReviews.length <= 2}
                        onClick={() => {
                            setIndexes(previewIndexes[0] - 1, previewReviews);
                        }}
                        className='border disabled:border-gray-200 disabled:text-gray-300 rounded-full flex items-center justify-center hover:ring-2 ring-gray-100 p-1'>
                        <ChevronLeftRoundedIcon />
                    </button>
                    <button
                        disabled={previewReviews.length <= 2}
                        onClick={() => {
                            setIndexes(previewIndexes[1] + 1, previewReviews);
                        }}
                        className='border disabled:border-gray-200 disabled:text-gray-300 rounded-full flex items-center justify-center hover:ring-2 ring-gray-100 p-1'>
                        <ChevronRightRoundedIcon />
                    </button>
                </div>
            </div>
            <div className='gap-2 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-1 2xl:grid-cols-2 mt-4'>
                {previewIndexes.map((reviewIndex, index) => {
                    const review = previewReviews[reviewIndex];
                    return (
                        <div
                            className='w-full border border-gray-300 hover:ring-2 ring-gray-200 rounded-md p-4 flex flex-col'
                            key={index}>
                            <div className='flex gap-2 items-center'>
                                <a href={`/profile/${review.owner.id}`} className='block'>
                                    <Photo
                                        src={review.owner.avatar}
                                        errorSrc={
                                            "https://media.licdn.com/dms/image/D5603AQFjj8ax4V-xAA/profile-displayphoto-shrink_800_800/0/1630492357650?e=2147483647&v=beta&t=YjkYny8bntrJCfZC9myByVcPUdSEt-7kM8e31ajsByo"
                                        }
                                        className='w-16 h-16 rounded-full object-cover'
                                    />
                                </a>
                                <div className=''>
                                    <a
                                        href={`/profile/${review.owner.id}`}
                                        className='font-bold'>
                                        {review.owner.username}
                                    </a>
                                    <h4 className='text-gray-500'>
                                        {moment(
                                            review.createdAt,
                                            "HH:mm DD/MM/YYYY"
                                        ).format("DD MMM YYYY")}
                                    </h4>
                                </div>
                            </div>
                            <RateStars rate={review.rate} className='my-2' />
                            <div className='break-all overflow-hidden text-medium'>
                                <span className='text-3xl font-bold'>“</span>
                                <XText ellipsis={{ maxLine: 5 }}>{review.content}</XText>
                                <span className='text-3xl font-bold'>”</span>
                            </div>
                        </div>
                    );
                })}
            </div>
            <button
                onClick={() => setShowMoreReviewsModal(true)}
                className='btn__primary px-3 py-2 mt-4'>
                Xem thêm đánh giá
            </button>
            {showMoreReviewsModal && (
                <Modal setOpenModal={setShowMoreReviewsModal}>
                    <ReviewsModalInner
                        reviews={reviews}
                        setReviews={setReviews}
                        userId={userId}
                        searchingTotalPages={totalPages}
                        page={page}
                        setPage={setPage}
                        totalItems={totalItems}
                    />
                </Modal>
            )}
        </div>
    );
}

function ReviewsModalInner({
    userId,
    reviews,
    setReviews,
    searchingTotalPages,
    page,
    setPage,
    totalItems,
}) {
    const [totalPages, setTotalPages] = React.useState(searchingTotalPages);
    const [lastPage, setLastPage] = React.useState(page);

    async function search() {
        if (lastPage >= page) {
            return;
        }

        var requestOptions = {
            method: "GET",
            redirect: "follow",
        };
        callRequest(
            `accommodation/house-owner/reviews?userId=${userId}&size=9&page=${page}&orderBy=created_At&isDescending=true`,
            requestOptions
        )
            .then((response) => {
                setReviews([...reviews, ...response.data.items]);
                setTotalPages(response.data.totalPages);
                setLastPage(response.data.page);
            })
            .catch((response) => {
                console.log(response);
            });
    }

    const [, lastElementRef] = useInfiniteScroll({
        page,
        setPage,
        totalPages,
        action: search,
    });

    return (
        <div className='w-[100] sm:w-[50vw] overflow-hidden'>
            <h3 className='text-xl font-bold'>{totalItems} đánh giá.</h3>
            <div className='max-h-[80vh] overflow-auto px-2'>
                {reviews.map((review, index) => (
                    <div
                        className='w-full border border-gray-300 rounded-md p-4 flex flex-col mt-2'
                        key={index}>
                        <div className='flex gap-2 items-center'>
                            <a href={`/profile/${review.owner.id}`} className='block'>
                                <Photo
                                    src={review.owner.avatar}
                                    errorSrc={
                                        "https://media.licdn.com/dms/image/D5603AQFjj8ax4V-xAA/profile-displayphoto-shrink_800_800/0/1630492357650?e=2147483647&v=beta&t=YjkYny8bntrJCfZC9myByVcPUdSEt-7kM8e31ajsByo"
                                    }
                                    className='w-16 h-16 rounded-full object-cover'
                                />
                            </a>
                            <div className=''>
                                <h4 className='font-bold'>{review.owner.username}</h4>
                                <h4 className='text-gray-500'>
                                    {moment(review.createdAt, "HH:mm DD/MM/YYYY").format(
                                        "DD MMM YYYY"
                                    )}
                                </h4>
                            </div>
                        </div>
                        <RateStars rate={review.rate} className='my-2' />
                        <div className='break-all overflow-hidden text-medium'>
                            <span className='text-3xl font-bold'>“</span>
                            <XText ellipsis={{ maxLine: 5 }}>{review.content}</XText>
                            <span className='text-3xl font-bold'>”</span>
                        </div>
                    </div>
                ))}
                <div className='' ref={lastElementRef}></div>
            </div>
        </div>
    );
}

function Homestay({ homestay }) {
    return (
        <a
            href={`/${homestay.id}`}
            className='rounded-md overflow-hidden border border-gray-200 flex flex-col h-full'>
            <Photo src={homestay.thumbnail} className='w-full h-48 object-cover' />
            <a className='p-4 block w-full overflow-ellipsis' href={`/${homestay.id}`}>
                <h3 className='text-md font-bold hover:text-indigo-500 w-full overflow-ellipsis break-words'>
                    {homestay.name}
                </h3>
                <h4 className='text-sm'>{homestay.shortDescription}</h4>
                <div className='grid grid-cols-[max-content_1fr] gap-2 items-center w-full mt-2'>
                    <LocationOnOutlinedIcon className='text-gray-500 scale-75' />
                    <XText
                        ellipsis={{ maxLine: 1, canShowMore: false }}
                        className='text-black text-sm text-left break-all'>
                        {homestay.address}
                    </XText>
                </div>
            </a>
            <div className='p-4 border-t mt-auto'>
                <div className='flex flex-col gap-2 items-start'>
                    <div className='flex'>
                        {homestay.reviewRate ? (
                            <div className='flex gap-2'>
                                {homestay.reviewRate < 4.2 && (
                                    <StarBorderOutlinedIcon className='block h-[1rem] mr-1' />
                                )}
                                {4.2 <= homestay.reviewRate &&
                                    homestay.reviewRate <= 4.8 && (
                                        <StarHalfOutlinedIcon className='block h-[1rem] mr-1' />
                                    )}
                                {4.8 < homestay.reviewRate && (
                                    <StarOutlinedIcon className='block h-[1rem] mr-1' />
                                )}
                                <h2 className='pr-4 block mt-1 m-auto'>
                                    {homestay.reviewRate}
                                </h2>
                            </div>
                        ) : (
                            <div className='flex gap-2 items-center'>
                                <StarBorderRoundedIcon className='text-gray-500' />
                                <h5 className=''>Chưa có đánh giá</h5>
                            </div>
                        )}
                        <h2 className='border-l ml-2 pl-2'>
                            {homestay.totalBookings ?? 0} đã đặt
                        </h2>
                    </div>
                    <h4 className='text-sm text-orange-500 rounded-md w-fit mr-auto'>{`${strings.toMoney(
                        homestay.minPrice
                    )} - ${strings.toMoney(homestay.maxPrice)} /Night`}</h4>
                </div>
            </div>
        </a>
    );
}
