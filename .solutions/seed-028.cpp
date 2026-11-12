#include <bits/stdc++.h>
using namespace std;

int n, k, L;
vector<long long> pre;  // pre[i] = 1..i번 상자 무게 합

// 적재 한도가 X일 때 필요한 트럭 수가 k 이하인지
bool feasible(long long X) {
    int pos = 0, trucks = 0;  // pos: 지금까지 실은 상자 수
    while (pos < n) {
        if (++trucks > k) return false;
        // 무게 기준으로 실을 수 있는 마지막 상자 위치
        int byWeight = int(upper_bound(pre.begin(), pre.end(), pre[pos] + X) - pre.begin()) - 1;
        int next = min(byWeight, pos + L);
        if (next == pos) return false;  // 한 상자도 못 싣는다
        pos = next;
    }
    return true;
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    cin >> n >> k >> L;
    pre.assign(n + 1, 0);
    for (int i = 1; i <= n; i++) {
        long long w;
        cin >> w;
        pre[i] = pre[i - 1] + w;
    }
    if ((long long)k * L < n) {
        cout << -1 << '\n';
        return 0;
    }
    long long lo = 0, hi = pre[n];  // feasible(hi) 는 참, feasible(lo-1) 은 거짓이 되도록 좁힌다
    while (lo < hi) {
        long long mid = lo + (hi - lo) / 2;
        if (feasible(mid)) hi = mid;
        else lo = mid + 1;
    }
    cout << lo << '\n';
}
