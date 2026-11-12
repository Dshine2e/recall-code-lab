#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<long long> arr(n), dur(n);
    for (int i = 0; i < n; i++) cin >> arr[i] >> dur[i];
    vector<int> byArrival(n);
    iota(byArrival.begin(), byArrival.end(), 0);
    sort(byArrival.begin(), byArrival.end(), [&](int x, int y) { return arr[x] < arr[y]; });

    // (소요 시간, 도착 시각, 번호) 가 가장 작은 것을 먼저 꺼낸다.
    typedef tuple<long long, long long, int> T;
    priority_queue<T, vector<T>, greater<T>> pq;
    long long now = 0, waitSum = 0;
    int ptr = 0;
    vector<int> order;
    order.reserve(n);
    while ((int)order.size() < n) {
        if (pq.empty() && arr[byArrival[ptr]] > now) now = arr[byArrival[ptr]];
        while (ptr < n && arr[byArrival[ptr]] <= now) {
            int j = byArrival[ptr++];
            pq.emplace(dur[j], arr[j], j);
        }
        auto [d, a, j] = pq.top();
        pq.pop();
        waitSum += now - a;
        now += d;
        order.push_back(j + 1);
    }
    for (int i = 0; i < n; i++) cout << order[i] << (i + 1 < n ? ' ' : '\n');
    cout << waitSum << '\n';
    return 0;
}
