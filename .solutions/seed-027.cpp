#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, k;
    cin >> n >> k;
    vector<int> a(n + 1);
    for (int i = 1; i <= n; i++) cin >> a[i];

    deque<int> dq;  // 인덱스, 앞에서 뒤로 값이 엄격히 줄어든다
    int best = INT_MAX, bestStart = -1;
    for (int i = 1; i <= n; i++) {
        while (!dq.empty() && a[dq.back()] <= a[i]) dq.pop_back();
        dq.push_back(i);
        while (dq.front() < i - k + 1) dq.pop_front();
        if (i >= k) {
            int start = i - k + 1;
            if (a[dq.front()] < best) {
                best = a[dq.front()];
                bestStart = start;
            }
        }
    }
    cout << best << ' ' << bestStart << '\n';
}
