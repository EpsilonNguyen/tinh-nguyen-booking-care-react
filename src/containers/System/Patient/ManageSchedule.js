import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import DatePicker from '../../../components/Input/DatePicker';
import './ManageSchedule.scss';
import { getAllScheduleForPatient, postSendRemedy } from '../../../services/userService';
import moment from 'moment';
import { LANGUAGES } from '../../../utils';
import { toast } from 'react-toastify';
import LoadingOverlay from 'react-loading-overlay';
import RemedyModal from '../../Patient/Doctor/RemedyModal';
import { postVerifyBookAppointment } from '../../../services/userService';

class ManageSchedule extends Component {

    constructor(props) {
        super(props)
        this.state = {
            currentDate: moment(new Date()).startOf('day').valueOf(),
            dataPatient: [],
            isOpenRemedyModal: false,
            dataModal: {},
            isShowLoading: false,
        }
    }

    async componentDidMount() {
        this.getDataPatient();
    }

    getDataPatient = async () => {
        let { user } = this.props;
        let { currentDate } = this.state;
        let formatedDate = new Date(currentDate).getTime();

        let res = await getAllScheduleForPatient({
            patientId: user.id,
            date: formatedDate
        })
        if (res && res.errCode === 0) {
            this.setState({
                dataPatient: res.data
            })
        }
    }

    handleOnChangeDatePicker = (date) => {
        this.setState({
            currentDate: date[0]
        }, async () => {
            await this.getDataPatient()
        })
    }

    handleBtnConfirm = async (item) => {
        let data = {
            token: item.token,
            doctorId: item.doctorId,
            action: 'confirm',
        }

        let res = await postVerifyBookAppointment(data);

        if (res && res.errCode === 0) {
            toast.success("Confirm schedule success!")
        }
        else {
            toast.error("Fail to confirm schedule!")
        }
    }

    handleBtnCancel = async (item) => {
        let data = {
            token: item.token,
            doctorId: item.doctorId,
            action: 'cancel',
        }

        let res = await postVerifyBookAppointment(data);

        if (res && res.errCode === 0) {
            toast.success("Delete schedule success!")
        }
        else {
            toast.error("Fail to delete schedule!")
        }
    }

    render() {
        let { dataPatient, isOpenRemedyModal, dataModal } = this.state;
        let { language } = this.props;

        return (
            <>
                <LoadingOverlay
                    active={this.state.isShowLoading}
                    spinner
                    text='Loading...'
                >

                    <div className='manage-patient-container'>
                        <div className='m-p-title'>
                            Quản lý kế hoạch khám bệnh
                        </div>
                        <div className='manage-patient-body row'>
                            <div className='col-4 form-group'>
                                <label>Chọn ngày khám</label>
                                <DatePicker
                                    onChange={this.handleOnChangeDatePicker}
                                    className='form-control'
                                    value={this.state.currentDate}
                                />
                            </div>
                            <div className='col-12 table-manage-patient'>
                                <table style={{ width: '100%' }}>
                                    <tbody>
                                        <tr>
                                            <th>STT</th>
                                            <th>Thời gian</th>
                                            <th>Họ và tên</th>
                                            <th>Địa chỉ</th>
                                            <th>Giới tính</th>
                                            <th>Action</th>
                                            <th>Action</th>
                                        </tr>

                                        {dataPatient && dataPatient.length > 0 ?
                                            dataPatient.map((item, index) => {
                                                let time = language === LANGUAGES.VI ?
                                                    item.timeTypeDataPatient.valueVi : item.timeTypeDataPatient.valueEn;
                                                let gender = language === LANGUAGES.VI ?
                                                    item.patientData.genderData.valueVi : item.patientData.genderData.valueEn;
                                                return (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{time}</td>
                                                        <td>{item.patientData.firstName}</td>
                                                        <td>{item.patientData.address}</td>
                                                        <td>{gender}</td>
                                                        <td>
                                                            <button className='mp-btn-confirm'
                                                                onClick={() => { this.handleBtnConfirm(item) }}
                                                            >Xác nhận</button>
                                                        </td>
                                                        <td>
                                                            <button className='mp-btn-cancel'
                                                                onClick={() => { this.handleBtnCancel(item) }}
                                                            >Hủy lịch</button>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                            :
                                            <tr>
                                                <td colSpan="7" style={{ textAlign: "center" }}>no data</td>
                                            </tr>
                                        }

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <RemedyModal
                        isOpenModal={isOpenRemedyModal}
                        dataModal={dataModal}
                        closeRemedyModal={this.closeRemedyModal}
                        sendRemedy={this.sendRemedy}
                    />
                </LoadingOverlay>
            </>
        )
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        user: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);
