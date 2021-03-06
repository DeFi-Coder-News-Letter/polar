import React from 'react';
import { IChart } from '@mrblenny/react-flow-chart';
import { fireEvent, wait } from '@testing-library/dom';
import { initChartFromNetwork } from 'utils/chart';
import { getNetwork, renderWithProviders } from 'utils/tests';
import NetworkDesigner from './NetworkDesigner';

describe('NetworkDesigner Component', () => {
  beforeAll(() => {
    // hard-code the values of offsetWidth & offsetHeight for div elements, otherwise
    // the FlowChart component will not render any nodes because they are not in view
    // see https://github.com/MrBlenny/react-flow-chart/blob/d47bcbd2c65d53295b12174ee74b25f54c497a36/src/components/Canvas/Canvas.wrapper.tsx#L122
    Object.defineProperties(window.HTMLDivElement.prototype, {
      offsetHeight: { get: () => 1000 },
      offsetWidth: { get: () => 1000 },
    });
  });

  const renderComponent = (charts?: Record<number, IChart>) => {
    const network = getNetwork(1, 'test network');
    const allCharts = charts || {
      1: initChartFromNetwork(network),
    };
    const initialState = {
      network: {
        networks: [network],
      },
      designer: {
        allCharts,
      },
    };
    const cmp = <NetworkDesigner network={network} updateStateDelay={0} />;
    return renderWithProviders(cmp, { initialState });
  };

  it('should render the designer component', () => {
    const { getByText } = renderComponent();
    expect(getByText('lnd-1')).toBeInTheDocument();
    expect(getByText('lnd-2')).toBeInTheDocument();
    expect(getByText('bitcoind-1')).toBeInTheDocument();
  });

  it('should render correct # of LND nodes', async () => {
    const { findAllByText } = renderComponent();
    expect(await findAllByText(/lnd-\d/)).toHaveLength(2);
  });

  it('should render correct # of bitcoind nodes', async () => {
    const { findAllByText } = renderComponent();
    expect(await findAllByText(/bitcoind-\d/)).toHaveLength(1);
  });

  it('should display the default message in the sidebar', async () => {
    const { findByText } = renderComponent();
    expect(await findByText('Network Designer')).toBeInTheDocument();
  });

  it('should update the redux state after a node is selected', async () => {
    const { getByText, store } = renderComponent();
    expect(store.getState().designer.activeChart.selected.id).toBeFalsy();
    await wait(() => fireEvent.click(getByText('lnd-1')));
    expect(store.getState().designer.activeChart.selected.id).not.toBeUndefined();
  });

  it('should not set the active chart if it doesnt exist', async () => {
    const { getByLabelText, store } = renderComponent({});
    expect(store.getState().designer.activeChart).toBeUndefined();
    expect(getByLabelText('icon: loading')).toBeInTheDocument();
  });

  it('should display node details in the sidebar when a node is selected', async () => {
    const { getByText, queryByText } = renderComponent();
    expect(getByText('bitcoind-1')).toBeInTheDocument();
    expect(queryByText('Node Type')).not.toBeInTheDocument();
    // click the bitcoind node in the chart
    await wait(() => fireEvent.click(getByText('bitcoind-1')));
    // ensure text from the sidebar is visible
    expect(getByText('Node Type')).toBeInTheDocument();
  });

  it('should display the OpenChannel modal', async () => {
    const { getByText, store } = renderComponent();
    await wait(() => store.getActions().modals.showOpenChannel({}));
    expect(getByText('Capacity (sats)')).toBeInTheDocument();
  });
});
