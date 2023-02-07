import actionTypes from '../actions/actionTypes';

const initialState = {
    genderArr: [],
    roleArr: [],
    positionArr: [],
    isLoadingGender: false,
    users: [],
    topDoctors: [],
    doctors: [],
    allScheduleTime: [],
    allRequiredDoctorInfor: [],
}

const adminReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_GENDER_START:
            return {
                ...state,
                isLoadingGender: true
            }
        case actionTypes.FETCH_GENDER_SUCCESS:
            // state.isLoadingGender = false;
            // state.genderArr = action.data;
            return {
                ...state,
                genderArr: action.data,
                isLoadingGender: false
            }
        case actionTypes.FETCH_GENDER_FAILED:
            return {
                ...state,
                genderArr: [],
                isLoadingGender: false
            }

        case actionTypes.FETCH_POSITION_SUCCESS:
            return {
                ...state,
                positionArr: action.data
            }
        case actionTypes.FETCH_POSITION_FAILED:
            return {
                ...state,
                positionArr: [],
            }

        case actionTypes.FETCH_ROLE_SUCCESS:
            return {
                ...state,
                roleArr: action.data
            }
        case actionTypes.FETCH_ROLE_FAILED:
            return {
                ...state,
                roleArr: []
            }

        case actionTypes.FETCH_ALL_USERS_SUCCESS:
            return {
                ...state,
                users: action.users
            }

        case actionTypes.FETCH_ALL_USERS_FAILED:
            return {
                ...state,
                users: []
            }

        case actionTypes.FETCH_TOP_DOCTOR_SUCCESS:
            return {
                ...state,
                topDoctors: action.data
            }

        case actionTypes.FETCH_TOP_DOCTOR_FAILED:
            return {
                ...state,
                topDoctors: []
            }

        case actionTypes.FETCH_ALL_DOCTORS_SUCCESS:
            state.doctors = action.data;
            return {
                ...state,
            }

        case actionTypes.FETCH_ALL_DOCTORS_FAILED:
            state.doctors = [];
            return {
                ...state,
            }

        case actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_SUCCESS:
            state.allScheduleTime = action.dataTime;
            return {
                ...state,
            }

        case actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_FAILED:
            state.allScheduleTime = [];
            return {
                ...state,
            }

        case actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_SUCCESS:
            state.allRequiredDoctorInfor = action.data;
            return {
                ...state,
            }

        case actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_FAILED:
            state.allRequiredDoctorInfor = [];
            return {
                ...state,
            }

        default:
            return state;
    }
}

export default adminReducer;