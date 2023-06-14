import { Component } from "react";
import { FormattedMessage } from 'react-intl';
import DatePicker from '../../../components/Input/DatePicker';
import * as actions from '../../../store/actions';
import { connect } from 'react-redux';
import { LANGUAGES } from '../../../utils';
import { getCountPatientByDate } from '../../../services/userService';
import './ManageSatistic.scss';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

class ManageSatistic extends Component {
    constructor(props) {
        super(props)
        this.state = {
            listDoctors: [],
            currentDate: '',
            listPatientConfirm: [],
            listDoctorConfirm: [],
        }
    }

    options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'BIỂU ĐỒ THỐNG KÊ BỆNH NHÂN THEO NGÀY',
            },
        },
    };

    componentDidMount() {
        this.props.fetchAllDoctors();
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.allDoctors !== this.props.allDoctors) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors);
            this.setState({
                listDoctors: dataSelect
            });
        }

        if (this.props.language !== prevProps.language) {

        }
    }

    handleOnChangeDatePicker = (date) => {
        this.setState({
            currentDate: date[0]
        })
    }

    buildDataInputSelect = (data) => {
        let result = [];
        let { language } = this.props;
        if (data && data.length > 0) {
            data.map((item, index) => {
                let name = '';
                let labelVi = `${item.lastName} ${item.firstName}`;
                let labelEn = `${item.firstName} ${item.lastName}`;
                name = language === LANGUAGES.VI ? labelVi : labelEn;
                result.push(name);
            })
        }
        return result;
    }

    handleOnClickCount = async () => {
        let formatedDate = new Date(this.state.currentDate).getTime();
        let res = await getCountPatientByDate(formatedDate);

        if (res && res.errCode === 0) {
            let listPatientConfirm = res.listPatientConfirm;
            let newListPatientConfirm = [];
            listPatientConfirm.map(item => {
                newListPatientConfirm.push(item.count);
            });

            let listDoctorConfirm = res.listDoctorConfirm;
            let newListDoctorConfirm = [];
            listDoctorConfirm.map(item => {
                newListDoctorConfirm.push(item.count);
            });

            this.setState({
                listPatientConfirm: newListPatientConfirm,
                listDoctorConfirm: newListDoctorConfirm
            })
        }
    }

    render() {
        let yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
        let data = {
            labels: this.state.listDoctors,
            datasets: [
                {
                    id: 1,
                    label: 'Số lượng bệnh nhân đã xác nhận lịch hẹn',
                    data: this.state.listPatientConfirm,
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                },
                {
                    id: 2,
                    label: 'Số lượng bệnh nhân đã khám',
                    data: this.state.listDoctorConfirm,
                    backgroundColor: 'rgba(53, 162, 235, 0.5)',
                },
            ],
        };

        return (
            <div className="container mt-3">
                <div className="d-flex ">
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id='manage-schedule.choose-date' /></label>
                        <DatePicker
                            onChange={this.handleOnChangeDatePicker}
                            className='form-control'
                            value={this.state.currentDate}
                            minDate={yesterday}
                        />
                    </div>
                    <button className="btn btn-primary form-group mt-4"
                        type="button" onClick={() => { this.handleOnClickCount() }}>Thống kê</button>
                </div>
                <Bar options={this.options} data={data} />
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        allDoctors: state.admin.doctors,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSatistic);