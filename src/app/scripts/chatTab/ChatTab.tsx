import * as React from "react";
import { Provider, Flex, Text, Header, Loader, Card, CardHeader, CardBody, Avatar } from "@fluentui/react-northstar";
import TeamsBaseComponent, { ITeamsBaseComponentState } from "msteams-react-base-component";
import * as microsoftTeams from "@microsoft/teams-js";
import { Divider } from "@fluentui/react-northstar/dist/es/components/Divider/Divider";
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme } from "victory";
import { Json } from "enzyme-to-json";
/**
 * State for the chatTabTab React component
 */
export interface IChatTabState extends ITeamsBaseComponentState {
    entityId?: string;
    loading: boolean;
    machineId: GUID;
    time: Date;
    voltage: number;
    temperature: number;
    light: number;
    sensor: any;
    intervalId?
}
type GUID = string & { isGuid: true};

/**
 * Properties for the chatTabTab React component
 */
export interface IChatTabProps {

}

/**
 * Implementation of the Chat content page
 */
export class ChatTab extends TeamsBaseComponent<IChatTabProps, IChatTabState> {


    public async componentWillMount() {
        this.updateTheme(this.getQueryVariable("theme"));


        if (await this.inTeams()) {
            microsoftTeams.initialize();
            microsoftTeams.registerOnThemeChangeHandler(this.updateTheme);
            microsoftTeams.getContext((context) => {
                microsoftTeams.appInitialization.notifySuccess();
                this.setState({
                    entityId: context.entityId
                });
                this.updateTheme(context.theme);
            });
        } else {
            this.setState({
                entityId: "This is not hosted in Microsoft Teams"
            });
        }

    }

    //  JACK: attempting to fetch api data and display it in the console
    // Tutorial:   https://www.youtube.com/watch?time_continue=76&v=T3Px88x_PsA&feature=emb_logo
    // I needed to add a proxy URL to get around a CORS fetch error. Append this to the front of a URL to get around the error https://cors-anywhere.herokuapp.com/
    // Current Sensor Data API: https://contexterebotapp.azurewebsites.net/api/sensordata/
    // Historical Sensor Data API: https://contexterebotapp.azurewebsites.net/api/sensordata/historical

    public async componentDidMount() {
        const intervalId = setInterval(() => this.loadData(), 1000);
        this.loadData(); // Load one immediately
    }

    public async componentWillUnmount() {
        clearInterval();
    }

    public async loadData() {
        const url = "https://contexterebotapp.azurewebsites.net/api/sensordata/";
        const proxy = "https://cors-anywhere.herokuapp.com/";
        const response = await fetch(proxy + url);
        const data = await response.json();
        this.setState({
            machineId: data.machineId,
            time: data.time, // Timestamp format: ISO 8601
            voltage: data.voltage,
            temperature: data.temperature,
            light: data.light,
            loading: false,
            sensor: data
        });
    }

    /**
     * The render() method to create the UI of the tab
     */
    public render() {
        const humanTime = new Date(this.state.time);
        return (<Provider theme={this.state.theme}>
                <Flex fill={true} column styles={{
                    padding: ".8rem 0 .8rem .5rem"
                }}>
                    <Flex.Item>
                        <Header content="Contextere sensor data extractor" />
                    </Flex.Item>
                    <Flex.Item>
                        <div>

                            <div>
                                <Text content={this.state.entityId} />
                            </div>

                            <Card>
                                <CardHeader>
                                    <Flex gap="gap.small">
                                        <Avatar
                                            image="../assets/agent_avatar.png"
                                            label="Intelligent Agent"
                                            name="Contextere"
                                            status="success"
                                        />
                                        <Flex column>
                                            <Text content="Contextere" weight="bold" />
                                            <Text content="Intelligent Agent" size="small" />
                                        </Flex>
                                    </Flex>
                                </CardHeader>
                                <CardBody>
                                    {this.state.loading || !this.state.voltage ? 
                                        <Loader label="Fetching voltage data..."/> 
                                        : 
                                        <div>
                                            <Text size="medium" weight="bold" content="Current voltage" /> 
                                            <br/>
                                            <Text timestamp content={humanTime.toLocaleTimeString()} />
                                            <Divider />
                                            <Text size="larger" weight="semibold" content={this.state.voltage + " volts"} />
                                        </div>
                                    }
                                </CardBody>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <Flex gap="gap.small">
                                        <Avatar
                                            image="../assets/agent_avatar.png"
                                            label="Intelligent Agent"
                                            name="Contextere"
                                            status="success"
                                        />
                                        <Flex column>
                                            <Text content="Contextere" weight="bold" />
                                            <Text content="Intelligent Agent" size="small" />
                                        </Flex>
                                    </Flex>
                                </CardHeader>
                                <CardBody>
                                    {this.state.loading || !this.state.temperature ? 
                                        <Loader label="Fetching temperature data..."/> 
                                        : 
                                        <div>
                                            <Text size="medium" weight="bold" content="Current internal temperature" /> 
                                            <br/>
                                            <Text timestamp content={humanTime.toLocaleTimeString()} />
                                            <Divider />
                                            <Text size="larger" weight="semibold" content={this.state.temperature + "\u00B0"+"C"} />
                                        </div>
                                    }
                                </CardBody>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <Flex gap="gap.small">
                                        <Avatar
                                            image="../assets/agent_avatar.png"
                                            label="Intelligent Agent"
                                            name="Contextere"
                                            status="success"
                                        />
                                        <Flex column>
                                            <Text content="Contextere" weight="bold" />
                                            <Text content="Intelligent Agent" size="small" />
                                        </Flex>
                                    </Flex>
                                </CardHeader>
                                <CardBody>
                                    {this.state.loading || !this.state.machineId ? 
                                        <Loader label="Fetching machine ID..."/> 
                                        : 
                                        <div>
                                            <Text size="medium" weight="bold" content="This machine's identifier" /> 
                                            <br/>
                                            <Text timestamp content={humanTime.toLocaleTimeString()} />
                                            <Divider />
                                            <Text size="medium" weight="semibold" content={this.state.machineId} />
                                        </div>
                                    }
                                </CardBody>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <Flex gap="gap.small">
                                        <Avatar
                                            image="../assets/agent_avatar.png"
                                            label="Intelligent Agent"
                                            name="Contextere"
                                            status="success"
                                        />
                                        <Flex column>
                                            <Text content="Contextere" weight="bold" />
                                            <Text content="Intelligent Agent" size="small" />
                                        </Flex>
                                    </Flex>
                                </CardHeader>
                                <CardBody>
                                    {this.state.loading || !this.state.machineId ? 
                                        <Loader label="Generating chart"/> 
                                        : 
                                        <div>
                                            <Text size="medium" weight="bold" content="Sample chart" /> 
                                            <br/>
                                            <Text timestamp content={humanTime.toLocaleTimeString()} />
                                            <Divider />
                                            <VictoryChart
                                                domainPadding={{x: 40}}
                                                width={250}
                                                height={300}
                                                theme={VictoryTheme.material}
                                            >
                                            <VictoryBar
                                                style={{data: {fill: "tomato", width: 50}}}
                                                data={[
                                                    {sensor: "Temp", value: this.state.temperature},
                                                    {sensor: "Voltage", value: this.state.voltage}
                                                ]}
                                                x="sensor"
                                                y="value"
                                                animate={{
                                                    duration: 200,
                                                    onLoad: {duration: 200}
                                                  }}                                            
                                            />
                                            <VictoryAxis
                                                label="Sensors"
                                                style={{
                                                    axisLabel: { padding: 30 }
                                                }}
                                            />
                                            <VictoryAxis dependentAxis
                                                label="Values"
                                                domain={[0, 250]}
                                                style={{
                                                    axisLabel: { padding: 40 }
                                                }}
                                            />
                                            </VictoryChart>
                                        </div>
                                    }
                                </CardBody>
                            </Card>
                            
                        </div>
                    </Flex.Item>
                    <Flex.Item styles={{
                        padding: ".8rem 0 .8rem .5rem"
                    }}>
                        <Text size="smaller" content="(C) Copyright Contextere" />
                    </Flex.Item>
                </Flex>
            </Provider>
        );
    }
}
