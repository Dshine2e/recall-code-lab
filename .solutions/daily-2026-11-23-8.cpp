#include <bits/stdc++.h>
using namespace std;
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n; cin >> n;
    vector<long long> a(n);
    for (auto &x : a) cin >> x;
    // 한 번의 스택 순회: 원소가 빠질 때 그 원소가 최솟값인 구간 수를 확정한다.
    // 왼쪽 경계: 엄격히 작은 값, 오른쪽 경계: 작거나 같은 값 (빠지게 만든 원소)
    vector<int> st;
    long long ans = 0;
    for (int i = 0; i <= n; i++) {
        long long cur = (i < n) ? a[i] : LLONG_MIN;
        while (!st.empty() && a[st.back()] >= cur) {
            int j = st.back(); st.pop_back();
            int l = st.empty() ? -1 : st.back();
            ans += a[j] * (long long)(j - l) * (i - j);
        }
        st.push_back(i);
    }
    cout << ans << '\n';
}
